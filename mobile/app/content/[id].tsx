import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useContentItem } from "../../src/hooks/useContentItem";

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useContentItem(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="p-4 text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="p-4 text-red-500">Not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
        <Text className="text-2xl font-bold">{data.title ?? data.url}</Text>
        <Text className="text-sm text-gray-500">{data.status}</Text>
        {data.summary && <Text className="text-base">{data.summary}</Text>}
        {data.extractedText && <Text className="text-base">{data.extractedText}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
