import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <View className="mb-2 flex-row gap-2">
        <View style={{ width: 44, height: 44, borderRadius: 999 }} className="bg-accent-pink dark:bg-[#5B3F47]" />
        <View style={{ width: 44, height: 44, borderTopLeftRadius: 22, borderBottomRightRadius: 22, borderTopRightRadius: 6, borderBottomLeftRadius: 6 }} className="bg-brand-light dark:bg-brand-deep" />
        <View style={{ width: 44, height: 44, borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} className="bg-accent-yellow dark:bg-accent-yellowDeep" />
      </View>
      <Text className="text-center font-heading text-title text-ink dark:text-paper">Your library is waiting</Text>
      <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
        Save an article, video or PDF and it appears here, ready to read offline.
      </Text>
      <View className="mt-2">
        <Button pill variant="primary" label="Save a link" onPress={() => router.push("/capture")} />
      </View>
      <Text className="text-center font-ui text-caption text-ink-soft dark:text-ink-faint">Or share a link into Ohara from any app.</Text>
    </View>
  );
}
