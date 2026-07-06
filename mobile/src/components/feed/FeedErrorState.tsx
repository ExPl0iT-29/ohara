import { Pressable, Text, View } from "react-native";

interface FeedErrorStateProps {
  onRetry: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <Text className="text-center text-lg font-semibold">Couldn't load your feed</Text>
      <Text className="text-center text-gray-500">Check your connection and try again.</Text>
      <Pressable className="rounded-lg border border-gray-300 px-4 py-2" onPress={onRetry}>
        <Text className="font-semibold text-gray-700">Retry</Text>
      </Pressable>
    </View>
  );
}
