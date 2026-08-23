import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { BrutalButton } from "../ui/BrutalButton";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-2 h-14 w-14 rounded-full border-3 border-ink bg-brand/40" />
      <Text className="text-center text-title text-ink dark:text-paper">Nothing saved yet</Text>
      <Text className="text-center text-body text-ink-soft dark:text-ink-faint">
        Save your first link to start reading.
      </Text>
      <BrutalButton pill variant="primary" onPress={() => router.push("/capture")} className="mt-2">
        <Text className="text-body font-extrabold text-ink">Save a link</Text>
      </BrutalButton>
      <Text className="text-center text-caption text-ink-faint">
        Or share a link into Ohara from any app.
      </Text>
    </View>
  );
}
