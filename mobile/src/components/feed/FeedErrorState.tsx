import { Text, View } from "react-native";

import { BrutalButton } from "../ui/BrutalButton";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-2 h-14 w-14 rounded-full border-3 border-ink bg-danger" />
      <Text className="text-center text-title text-ink dark:text-paper">Couldn't load your feed</Text>
      <Text className="text-center text-body text-ink-soft dark:text-ink-faint">
        Check your connection and try again.
      </Text>
      <BrutalButton pill onPress={onRetry} className="mt-2">
        <Text className="text-body font-extrabold text-ink">Retry</Text>
      </BrutalButton>
    </View>
  );
}
