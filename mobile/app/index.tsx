import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, View } from "react-native";

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
import { FeedListItem } from "../src/components/feed/FeedListItem";
import { Chip } from "../src/components/ui/Chip";
import { Fab } from "../src/components/ui/Fab";
import { IconButton } from "../src/components/ui/IconButton";
import { Screen } from "../src/components/ui/Screen";
import { TextField } from "../src/components/ui/TextField";
import { useContentList } from "../src/hooks/useContentList";
import { logSinceBundleStart } from "../src/perf";
import { useTheme } from "../src/theme/useTheme";

export default function FeedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
  const featureFirst = !archived && !isFiltered;
  const renderItem = useCallback(
    ({ item, index }: { item: ContentItem; index: number }) => (
      <FeedListItem
        item={item}
        featured={featureFirst && index === 0}
        onPress={handleOpenItem}
        onToggleArchive={handleToggleArchive}
      />
    ),
    [featureFirst, handleOpenItem, handleToggleArchive],
  );
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
        <Text className="font-heading text-display text-ink dark:text-paper">Ohara</Text>
        <IconButton glyph="⚙" accessibilityLabel="Settings" onPress={() => router.push("/settings")} />
      </View>

      <View className="flex-row gap-2 px-5 pb-3">
        <Chip size="md" label="Active" selected={!archived} onPress={() => setArchived(false)} />
        <Chip size="md" label="Archived" selected={archived} onPress={() => setArchived(true)} />
      </View>

      <View className="px-5 pb-2">
        <TextField value={search} onChangeText={setSearch} placeholder="Search titles and text" returnKeyType="search" />
      </View>

      {(typeChips.length > 0 || tagChips.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, alignItems: "center", paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 }}
        >
          {typeChips.map((type) => {
            const selected = contentType === type;
            return (
              <Chip
                key={`type-${type}`}
                label={CONTENT_TYPE_LABELS[type]}
                selected={selected}
                onPress={() => setContentType(selected ? null : type)}
              />
            );
          })}
          {tagChips.map((chip) => {
            const selected = tag === chip;
            return (
              <Chip key={chip} tone="tag" label={chip} selected={selected} onPress={() => setTag(selected ? null : chip)} />
            );
          })}
        </ScrollView>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color={colors.text} size="large" />
          <Text className="font-ui text-caption font-bold text-ink-soft dark:text-ink-faint">Opening your library…</Text>
        </View>
      ) : error ? (
        <FeedErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        isFiltered ? (
          <View className="flex-1 items-center justify-center gap-2 p-8">
            <Text className="text-center font-heading text-title text-ink dark:text-paper">No matches</Text>
            <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
              Nothing in your library matches that search or filter.
            </Text>
          </View>
        ) : archived ? (
          <View className="flex-1 items-center justify-center gap-2 p-8">
            <Text className="text-center font-heading text-title text-ink dark:text-paper">Nothing archived yet</Text>
            <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
              Swipe an item left and tap DONE once you have finished with it.
            </Text>
          </View>
        ) : (
          <FeedEmptyState />
        )
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 112, gap: 14 }}
          refreshControl={<RefreshControl tintColor={colors.text} colors={[colors.text]} refreshing={isFetching} onRefresh={refetch} />}
          renderItem={renderItem}
        />
      )}

      <Fab onPress={handleOpenCapture} accessibilityLabel="Save a link" />
    </Screen>
  );
}
