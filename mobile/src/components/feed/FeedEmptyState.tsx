import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-2 h-14 w-14 rounded-full bg-brand-light" />
      <Text className="text-center text-title text-ink">Nothing saved yet</Text>
      <Text className="text-center text-body text-ink-soft">
        Save your first link to start reading.
      </Text>
      <Pressable
        className="mt-2 rounded-pill bg-brand px-5 py-2.5 active:opacity-80"
        onPress={() => router.push("/capture")}
      >
        <Text className="text-body font-semibold text-white">Save a link</Text>
      </Pressable>
    </View>
  );
}
