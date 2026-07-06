import { Text, View } from "react-native";

interface ReaderSummaryProps {
  summary: string | null;
}

export function ReaderSummary({ summary }: ReaderSummaryProps) {
  if (!summary) return null;

  return (
    <View className="rounded-lg bg-gray-50 p-4">
      <Text className="text-base italic leading-relaxed text-gray-700">{summary}</Text>
    </View>
  );
}
