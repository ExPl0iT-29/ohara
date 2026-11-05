import { Text, View } from "react-native";

import { Button } from "../ui/Button";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 justify-center gap-4 px-8">
      <Text className="font-heading text-title text-ink dark:text-paper">Your library didn't load</Text>
      <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
        Something went wrong reading the saved items on this phone. Try again.
      </Text>
      <View className="mt-2 self-start">
        <Button pill label="Try again" onPress={onRetry} />
      </View>
    </View>
  );
}
