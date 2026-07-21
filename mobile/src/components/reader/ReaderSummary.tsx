import { Text, View } from "react-native";

interface ReaderSummaryProps {
  summary: string | null;
}

export function ReaderSummary({ summary }: ReaderSummaryProps) {
  if (!summary) return null;

  return (
    <View className="rounded-card border-3 border-ink bg-accent-mint/20 p-4">
      <Text className="text-body italic leading-relaxed text-ink-soft dark:text-ink-faint">{summary}</Text>
    </View>
  );
}
