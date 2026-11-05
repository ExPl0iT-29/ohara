import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-2 h-14 w-14 rounded-full border-3 border-ink bg-brand/40" />
      <Text className="font-heading text-center text-title text-ink dark:text-paper">Nothing saved yet</Text>
      <Text className="font-ui text-center text-body text-ink-soft dark:text-ink-faint">
        Save your first link to start reading.
      </Text>
      <View className="mt-2">
        <Button pill variant="primary" label="Save a link" onPress={() => router.push("/capture")} />
      </View>
      <Text className="font-ui text-center text-caption text-ink-faint">
        Or share a link into Ohara from any app.
      </Text>
    </View>
  );
}
