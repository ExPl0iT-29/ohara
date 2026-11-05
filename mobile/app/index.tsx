import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useQueryClient } from "@tanstack/react-query";

import {
  archiveContent,
  getAllTagsList,
  getPresentContentTypesList,
  unarchiveContent,
  type ContentItem,
  type ContentType,
} from "../src/api/content";
import { CONTENT_TYPE_LABELS } from "../src/constants/contentTypeLabels";
import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { BOTTOM_NAV_HEIGHT, BottomNav } from "../src/components/feed/BottomNav";
import { ContinueCard } from "../src/components/feed/ContinueCard";
import { FeedListItem, type RowPosition } from "../src/components/feed/FeedListItem";
import { Chip } from "../src/components/ui/Chip";
import { Eyebrow } from "../src/components/ui/Eyebrow";
import { Fab } from "../src/components/ui/Fab";
import { IconButton } from "../src/components/ui/IconButton";
import { Screen } from "../src/components/ui/Screen";
import { TextField } from "../src/components/ui/TextField";
import { isInProgress } from "../src/format/itemMeta";
import { useContentList } from "../src/hooks/useContentList";
import { logSinceBundleStart } from "../src/perf";
import { useTheme } from "../src/theme/useTheme";

export default function FeedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [archived, setArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const { data, isLoading, isFetching, error, refetch } = useContentList({
    archived,
    search: search || undefined,
    tag: tag ?? undefined,
    contentType: contentType ?? undefined,
  });
  const tagChips = useMemo(() => getAllTagsList(), [data]);
  const typeChips = useMemo(() => getPresentContentTypesList(), [data]);

  useEffect(() => {
    if (!isLoading) logSinceBundleStart("Feed screen: first content rendered");
  }, [isLoading]);

  const handleOpenItem = useCallback((id: string) => router.push(`/content/${id}`), [router]);
  const handleOpenCapture = useCallback(() => router.push("/capture"), [router]);
  const handleToggleArchive = useCallback(
    (item: ContentItem) => {
      if (item.archivedAt) {
        unarchiveContent(item.id);
      } else {
        archiveContent(item.id);
      }
      void queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    [queryClient],
  );
  const isFiltered = !!search || !!tag || !!contentType;
  // Unfiltered active library: the latest unfinished item becomes a hero card.
  const continueItem = useMemo(
    () => (archived || isFiltered ? undefined : (data ?? []).find(isInProgress)),
    [data, archived, isFiltered],
  );
  const rows = useMemo(
    () => (data ?? []).filter((item) => item.id !== continueItem?.id),
    [data, continueItem],
  );
  const positionOf = useCallback(
    (index: number): RowPosition => {
      if (rows.length === 1) return "single";
      if (index === 0) return "first";
      return index === rows.length - 1 ? "last" : "middle";
    },
    [rows.length],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: ContentItem; index: number }) => (
      <FeedListItem item={item} position={positionOf(index)} onPress={handleOpenItem} onToggleArchive={handleToggleArchive} />
    ),
    [handleOpenItem, handleToggleArchive, positionOf],
  );
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);
  const navSpace = BOTTOM_NAV_HEIGHT + insets.bottom;

  return (
    <Screen edges={["top", "left", "right"]}>
      <View className="flex-row items-center gap-3 px-4 pb-2 pt-3">
        <View className="flex-1">
          <TextField value={search} onChangeText={setSearch} placeholder="Search your library" returnKeyType="search" />
        </View>
        <IconButton glyph="⚙" accessibilityLabel="Settings" onPress={() => router.push("/settings")} />
      </View>

      <Text className="px-5 pb-3 pt-2 font-heading text-display text-ink dark:text-paper">{archived ? "Archive" : "Library"}</Text>

      {(typeChips.length > 0 || tagChips.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 }}
        >
          {typeChips.map((type) => {
            const selected = contentType === type;
            return (
              <Chip key={`type-${type}`} label={CONTENT_TYPE_LABELS[type]} selected={selected} onPress={() => setContentType(selected ? null : type)} />
            );
          })}
          {tagChips.map((chip) => {
            const selected = tag === chip;
            return <Chip key={chip} tone="tag" label={chip} selected={selected} onPress={() => setTag(selected ? null : chip)} />;
          })}
        </ScrollView>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3" style={{ paddingBottom: navSpace }}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">Opening your library…</Text>
        </View>
      ) : error ? (
        <View className="flex-1" style={{ paddingBottom: navSpace }}>
          <FeedErrorState onRetry={() => refetch()} />
        </View>
      ) : !data || data.length === 0 ? (
        <View className="flex-1" style={{ paddingBottom: navSpace }}>
          {isFiltered ? (
            <View className="flex-1 items-center justify-center gap-2 px-8">
              <Text className="text-center font-heading text-title text-ink dark:text-paper">No matches</Text>
              <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
                Nothing in your library matches that search or filter.
              </Text>
            </View>
          ) : archived ? (
            <View className="flex-1 items-center justify-center gap-2 px-8">
              <Text className="text-center font-heading text-title text-ink dark:text-paper">Nothing archived yet</Text>
              <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
                Swipe an item left and choose Archive once you have finished with it.
              </Text>
            </View>
          ) : (
            <FeedEmptyState />
          )}
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={
            continueItem ? (
              <View>
                <ContinueCard item={continueItem} onPress={handleOpenItem} />
                {rows.length > 0 && (
                  <View className="px-5 pb-2">
                    <Eyebrow label="Recently saved" />
                  </View>
                )}
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: navSpace + 96 }}
          refreshControl={
            <RefreshControl tintColor={colors.accent} colors={[colors.accent]} refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <Fab onPress={handleOpenCapture} accessibilityLabel="Save a link" bottomOffset={navSpace + 16} />
      <BottomNav
        destinations={[
          { key: "library", label: "Library", glyph: "▤", selected: !archived, onPress: () => setArchived(false) },
          { key: "archive", label: "Archive", glyph: "⇣", selected: archived, onPress: () => setArchived(true) },
          { key: "settings", label: "Settings", glyph: "⚙", selected: false, onPress: () => router.push("/settings") },
        ]}
      />
    </Screen>
  );
}
