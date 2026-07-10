import { Linking, Pressable, Text, View } from "react-native";

interface ReaderStatusNoticeProps {
  variant: "preparing" | "failed";
  url: string;
  onRetry?: () => void;
}

const COPY = {
  preparing: "This item is still being prepared — check back shortly.",
  failed: "This item couldn't be fully processed. You can still open the original.",
};

export function ReaderStatusNotice({ variant, url, onRetry }: ReaderStatusNoticeProps) {
  return (
    <View
      className={`gap-3 rounded-card border p-4 ${
        variant === "failed"
          ? "border-danger-light bg-danger-light/40 dark:border-danger/40 dark:bg-danger/10"
          : "border-line bg-white dark:border-ink-soft dark:bg-surface-dark"
      }`}
    >
      <Text className="text-body text-ink-soft dark:text-ink-faint">{COPY[variant]}</Text>
      <Pressable onPress={() => Linking.openURL(url)}>
        <Text className="text-body font-semibold text-brand">Open original ↗</Text>
      </Pressable>
      {variant === "failed" && onRetry && (
        <Pressable onPress={onRetry}>
          <Text className="text-body font-semibold text-brand">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}
