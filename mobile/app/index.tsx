import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQueryClient } from "@tanstack/react-query";

import { archiveContent, unarchiveContent, type ContentItem } from "../src/api/content";
import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { FeedListItem } from "../src/components/feed/FeedListItem";
import { useContentList } from "../src/hooks/useContentList";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FeedScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [archived, setArchived] = useState(false);
  const { data, isLoading, isFetching, error, refetch } = useContentList({ archived });
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

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
          className={`rounded-pill border px-4 py-1.5 ${archived ? "border-line dark:border-ink-soft" : "border-brand bg-brand"}`}
          onPress={() => setArchived(false)}
        >
          <Text className={archived ? "text-caption text-ink-soft dark:text-ink-faint" : "text-caption font-semibold text-white"}>
            Active
          </Text>
        </Pressable>
        <Pressable
          className={`rounded-pill border px-4 py-1.5 ${archived ? "border-brand bg-brand" : "border-line dark:border-ink-soft"}`}
          onPress={() => setArchived(true)}
        >
          <Text className={archived ? "text-caption font-semibold text-white" : "text-caption text-ink-soft dark:text-ink-faint"}>
            Archived
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#0F766E" />
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
          refreshControl={<RefreshControl tintColor="#0F766E" refreshing={isFetching} onRefresh={refetch} />}
          renderItem={renderItem}
        />
      )}

      <AnimatedPressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg"
        style={fabStyle}
        onPressIn={() => {
          fabScale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          fabScale.value = withSpring(1);
        }}
        onPress={handleOpenCapture}
      >
        <Text className="text-3xl leading-none text-white">+</Text>
      </AnimatedPressable>
    </SafeAreaView>
  );
}
