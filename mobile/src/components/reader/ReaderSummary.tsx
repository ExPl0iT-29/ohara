import { Text, View } from "react-native";

interface ReaderSummaryProps {
  summary: string | null;
}

export function ReaderSummary({ summary }: ReaderSummaryProps) {
  if (!summary) return null;

  return (
    <View className="rounded-card border border-line bg-brand-light/40 p-4 dark:border-ink-soft dark:bg-brand-dark/20">
      <Text className="text-body italic leading-relaxed text-ink-soft dark:text-ink-faint">{summary}</Text>
    </View>
  );
}
