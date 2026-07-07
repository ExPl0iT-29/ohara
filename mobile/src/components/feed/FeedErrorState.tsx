import { Pressable, Text, View } from "react-native";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <View className="mb-2 h-14 w-14 rounded-full bg-danger-light" />
      <Text className="text-center text-title text-ink">Couldn't load your feed</Text>
      <Text className="text-center text-body text-ink-soft">Check your connection and try again.</Text>
      <Pressable
        className="mt-2 rounded-pill border border-line px-5 py-2.5 active:opacity-70"
        onPress={onRetry}
      >
        <Text className="text-body font-semibold text-ink">Retry</Text>
      </Pressable>
    </View>
  );
}
