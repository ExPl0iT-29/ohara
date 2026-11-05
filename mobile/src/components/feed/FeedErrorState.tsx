import { Text, View } from "react-native";

import { Button } from "../ui/Button";
import { HardShadow } from "../ui/HardShadow";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-3">
        <HardShadow offset={3} radius={12}>
          <View className="h-12 w-12 rounded-xl border-2.5 border-line bg-danger dark:border-line-dark" />
        </HardShadow>
      </View>
      <Text className="text-center font-heading text-title text-ink dark:text-paper">Your library didn't load</Text>
      <Text className="text-center font-ui text-body text-ink-soft dark:text-ink-faint">
        Something went wrong reading the saved items on this phone.
      </Text>
      <View className="mt-2">
        <Button pill label="Try again" onPress={onRetry} />
      </View>
    </View>
  );
}
