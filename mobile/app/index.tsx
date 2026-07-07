import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ContentItem } from "../src/api/content";
import { FeedEmptyState } from "../src/components/feed/FeedEmptyState";
import { FeedErrorState } from "../src/components/feed/FeedErrorState";
import { FeedListItem } from "../src/components/feed/FeedListItem";
import { useContentList } from "../src/hooks/useContentList";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FeedScreen() {
  const router = useRouter();
  const { data, isLoading, isFetching, error, refetch } = useContentList();
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const handleOpenItem = useCallback((id: string) => router.push(`/content/${id}`), [router]);
  const handleOpenCapture = useCallback(() => router.push("/capture"), [router]);
  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => <FeedListItem item={item} onPress={handleOpenItem} />,
    [handleOpenItem],
  );
  const keyExtractor = useCallback((item: ContentItem) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <Text className="px-5 pb-2 pt-4 text-display text-ink">Ohara</Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#0F766E" />
        </View>
      ) : error ? (
        <FeedErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <FeedEmptyState />
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
