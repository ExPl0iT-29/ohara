import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useContentList } from "../src/hooks/useContentList";

export default function FeedScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useContentList();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="px-4 pt-4 text-2xl font-bold">Ohara</Text>

      {isLoading && <Text className="p-4 text-gray-500">Loading...</Text>}
      {error && <Text className="p-4 text-red-500">{String(error)}</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <Pressable
            className="rounded-lg border border-gray-200 p-3"
            onPress={() => router.push(`/content/${item.id}`)}
          >
            <Text className="font-semibold">{item.title ?? item.url}</Text>
            <Text className="text-sm text-gray-500">{item.status}</Text>
          </Pressable>
        )}
      />

      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600"
        onPress={() => router.push("/capture")}
      >
        <Text className="text-3xl leading-none text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
