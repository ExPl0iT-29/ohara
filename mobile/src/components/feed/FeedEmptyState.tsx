import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <Text className="text-center text-lg font-semibold">Nothing saved yet</Text>
      <Text className="text-center text-gray-500">
        Save your first link to start reading.
      </Text>
      <Pressable className="rounded-lg bg-blue-600 px-4 py-2" onPress={() => router.push("/capture")}>
        <Text className="font-semibold text-white">Save a link</Text>
      </Pressable>
    </View>
  );
}
