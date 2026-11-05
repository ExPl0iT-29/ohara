import { Text, View } from "react-native";

import { Button } from "../ui/Button";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <View style={{ width: 48, height: 48, borderRadius: 16 }} className="bg-danger-light dark:bg-danger-deep" />
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
