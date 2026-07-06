import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { FeedStatusBadge } from "../src/components/feed/FeedStatusBadge";
import { useContentList } from "../src/hooks/useContentList";

export default function FeedScreen() {
  const router = useRouter();
  const { data, isLoading, isFetching, error, refetch } = useContentList();

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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <Pressable
              className="rounded-lg border border-gray-200 p-3"
              onPress={() => router.push(`/content/${item.id}`)}
            >
              <Text className="font-semibold">{item.title ?? item.url}</Text>
              <FeedStatusBadge status={item.status} />
            </Pressable>
          )}
        />
      )}

      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600"
        onPress={() => router.push("/capture")}
      >
        <Text className="text-3xl leading-none text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
