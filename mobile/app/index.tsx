import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, SectionList, Text, View } from "react-native";

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
import { Eyebrow } from "../src/components/ui/Eyebrow";
import { Fab } from "../src/components/ui/Fab";
import { Screen } from "../src/components/ui/Screen";
import { TextField } from "../src/components/ui/TextField";
import { isInProgress } from "../src/format/itemMeta";
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
  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => (
      <FeedListItem item={item} onPress={handleOpenItem} onToggleArchive={handleToggleArchive} />
    ),
    [handleOpenItem, handleToggleArchive],
  );
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);
  const isFiltered = !!search || !!tag || !!contentType;

  // Unfiltered active library: unfinished items first, under their own heading.
  const sections = useMemo(() => {
    const items = data ?? [];
    if (archived || isFiltered) return [{ title: archived ? "Archived" : "Results", data: items }];
    const inProgress = items.filter(isInProgress);
    const rest = items.filter((item) => !isInProgress(item));
    return [
      ...(inProgress.length ? [{ title: "Continue reading", data: inProgress }] : []),
      ...(rest.length ? [{ title: inProgress.length ? "Recently saved" : "Saved", data: rest }] : []),
    ];
  }, [data, archived, isFiltered]);

  return (
    <Screen>
      <View className="flex-row items-baseline justify-between px-5 pb-1 pt-5">
        <Text className="font-heading text-display text-ink dark:text-paper">Library</Text>
        <Pressable onPress={() => router.push("/settings")} accessibilityRole="button" hitSlop={12}>
          <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">Settings</Text>
        </Pressable>
      </View>

      <View className="mx-5 mt-3 flex-row gap-6 border-b border-line dark:border-line-dark">
        {[
          { label: "Active", value: false },
          { label: "Archived", value: true },
        ].map((tab) => {
          const selected = archived === tab.value;
          return (
            <Pressable
              key={tab.label}
              onPress={() => setArchived(tab.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              className={`-mb-px pb-2.5 ${selected ? "border-b-2 border-ink dark:border-paper" : ""}`}
            >
              <Text
                className={`font-ui text-caption ${selected ? "font-semibold text-ink dark:text-paper" : "text-ink-soft dark:text-ink-faint"}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="px-5 pb-2 pt-4">
        <TextField value={search} onChangeText={setSearch} placeholder="Search titles and text" />
      </View>

      {(typeChips.length > 0 || tagChips.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, alignItems: "center", paddingHorizontal: 20, paddingBottom: 8 }}
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
          <ActivityIndicator color={colors.accent} size="large" />
          <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">Opening your library…</Text>
        </View>
      ) : error ? (
        <FeedErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        isFiltered ? (
          <View className="flex-1 justify-center gap-2 px-8">
            <Text className="font-heading text-title text-ink dark:text-paper">No matches</Text>
            <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
              Nothing in your library matches that search or filter.
            </Text>
          </View>
        ) : archived ? (
          <View className="flex-1 justify-center gap-2 px-8">
            <Text className="font-heading text-title text-ink dark:text-paper">Nothing archived yet</Text>
            <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
              Swipe an item left and choose Archive once you have finished with it.
            </Text>
          </View>
        ) : (
          <FeedEmptyState />
        )
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View className="px-5 pb-1 pt-5">
              <Eyebrow label={section.title} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 112 }}
          refreshControl={
            <RefreshControl tintColor={colors.accent} colors={[colors.accent]} refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <Fab onPress={handleOpenCapture} accessibilityLabel="Save a link" />
    </Screen>
  );
}
