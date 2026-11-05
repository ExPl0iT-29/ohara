import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../ui/Button";
import { HardShadow } from "../ui/HardShadow";

export function FeedEmptyState() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-3 flex-row gap-3">
        {["bg-accent-yellow", "bg-accent-pink", "bg-accent-violet"].map((bg, index) => (
          <HardShadow key={bg} offset={3} radius={12}>
            <View
              className={`h-12 w-12 rounded-xl border-2.5 border-line dark:border-line-dark ${bg}`}
              style={{ transform: [{ rotate: `${(index - 1) * 6}deg` }] }}
            />
          </HardShadow>
        ))}
      </View>
      <Text className="text-center font-heading text-title text-ink dark:text-paper">Your library is waiting</Text>
      <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
        Save an article, video or PDF and it lands here, ready to read offline.
      </Text>
      <View className="mt-2">
        <Button pill variant="primary" label="Save a link" onPress={() => router.push("/capture")} />
      </View>
      <Text className="text-center font-ui text-caption text-ink-faint">Or share a link into Ohara from any app.</Text>
    </View>
  );
}
