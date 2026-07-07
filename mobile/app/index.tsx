import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ContentItem } from "../src/api/content";
import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { FeedListItem } from "../src/components/feed/FeedListItem";
import { useContentList } from "../src/hooks/useContentList";

export default function FeedScreen() {
  const router = useRouter();
  const { data, isLoading, isFetching, error, refetch } = useContentList();

  const handleOpenItem = useCallback((id: string) => router.push(`/content/${id}`), [router]);
  const handleOpenCapture = useCallback(() => router.push("/capture"), [router]);
  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => <FeedListItem item={item} onPress={handleOpenItem} />,
    [handleOpenItem],
  );
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="px-4 pt-4 text-2xl font-bold">Ohara</Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <FeedErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <FeedEmptyState />
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          renderItem={renderItem}
        />
      )}

      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600"
        onPress={handleOpenCapture}
      >
        <Text className="text-3xl leading-none text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
