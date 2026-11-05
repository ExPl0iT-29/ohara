import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center gap-4 px-8">
      <Text className="font-heading text-display text-ink dark:text-paper">Every library begins with a single page.</Text>
      <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
        Save an article, a video or a PDF, and it waits here, clean and readable, even offline.
      </Text>
      <View className="mt-2 self-start">
        <Button pill variant="primary" label="Save a link" onPress={() => router.push("/capture")} />
      </View>
      <Text className="font-ui text-caption text-ink-faint">Or share a link into Ohara from any app.</Text>
    </View>
  );
}
