import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQueryClient } from "@tanstack/react-query";

import {
  archiveContent,
  getAllTagsAndTopicsList,
  getPresentContentTypesList,
  unarchiveContent,
  type ContentItem,
  type ContentType,
} from "../src/api/content";
import { CONTENT_TYPE_LABELS } from "../src/constants/contentTypeLabels";
import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { FeedListItem } from "../src/components/feed/FeedListItem";
import { useContentList } from "../src/hooks/useContentList";
import { logSinceBundleStart } from "../src/perf";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FeedScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [archived, setArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [tagOrTopic, setTagOrTopic] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const { data, isLoading, isFetching, error, refetch } = useContentList({
    archived,
    search: search || undefined,
    tagOrTopic: tagOrTopic ?? undefined,
    contentType: contentType ?? undefined,
  });
  const tagChips = useMemo(() => getAllTagsAndTopicsList(), [data]);
  const typeChips = useMemo(() => getPresentContentTypesList(), [data]);
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

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

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Text className="text-display text-ink dark:text-paper">Ohara</Text>
        <Pressable onPress={() => router.push("/settings")}>
          <Text className="text-caption text-ink-soft dark:text-ink-faint">Settings</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-2 px-5 pb-2">
        <Pressable
          className={`rounded-pill border-3 border-ink px-4 py-1.5 ${archived ? "bg-paper dark:bg-surface-dark" : "bg-brand"}`}
          onPress={() => setArchived(false)}
        >
          <Text className="text-caption font-bold text-ink">Active</Text>
        </Pressable>
        <Pressable
          className={`rounded-pill border-3 border-ink px-4 py-1.5 ${archived ? "bg-brand" : "bg-paper dark:bg-surface-dark"}`}
          onPress={() => setArchived(true)}
        >
          <Text className="text-caption font-bold text-ink">Archived</Text>
        </Pressable>
      </View>

      <View className="px-5 pb-2">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search your library"
          placeholderTextColor="#A8A29E"
          className="rounded-pill border-3 border-ink px-4 py-2 text-body text-ink dark:text-paper"
        />
      </View>

      {(typeChips.length > 0 || tagChips.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 40 }}
          className="px-5 pb-2"
          contentContainerStyle={{ gap: 8, alignItems: "center" }}
        >
          {typeChips.map((type) => {
            const selected = contentType === type;
            return (
              <Pressable
                key={`type-${type}`}
                className={`rounded-pill border-2 border-ink px-3 py-1 ${selected ? "bg-brand" : "bg-paper dark:bg-surface-dark"}`}
                onPress={() => setContentType(selected ? null : type)}
              >
                <Text className="text-caption font-bold text-ink">{CONTENT_TYPE_LABELS[type]}</Text>
              </Pressable>
            );
          })}
          {tagChips.map((chip) => {
            const selected = tagOrTopic === chip;
            return (
              <Pressable
                key={chip}
                className={`rounded-pill border-2 border-ink px-3 py-1 ${selected ? "bg-accent-violet" : "bg-paper dark:bg-surface-dark"}`}
                onPress={() => setTagOrTopic(selected ? null : chip)}
              >
                <Text className="text-caption font-bold text-ink">{chip}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#1C1917" size="large" />
          <Text className="text-caption font-bold text-ink-soft dark:text-ink-faint">
            Loading your library...
          </Text>
        </View>
      ) : error ? (
        <FeedErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        archived ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-body text-ink-soft dark:text-ink-faint">Nothing archived yet.</Text>
          </View>
        ) : (
          <FeedEmptyState />
        )
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          refreshControl={<RefreshControl tintColor="#1C1917" refreshing={isFetching} onRefresh={refetch} />}
          renderItem={renderItem}
        />
      )}

      <View pointerEvents="box-none" className="absolute bottom-8 right-6">
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            right: -5,
            bottom: -5,
            backgroundColor: "#1C1917",
            borderRadius: 999,
          }}
        />
        <AnimatedPressable
          className="h-14 w-14 items-center justify-center rounded-full border-3 border-ink bg-brand"
          style={fabStyle}
          onPressIn={() => {
            fabScale.value = withSpring(0.9);
          }}
          onPressOut={() => {
            fabScale.value = withSpring(1);
          }}
          onPress={handleOpenCapture}
        >
          <Text className="text-3xl font-extrabold leading-none text-ink">+</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}
