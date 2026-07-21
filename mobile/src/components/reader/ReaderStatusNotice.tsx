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
      className={`gap-3 rounded-card border-3 border-ink p-4 ${
        variant === "failed" ? "bg-danger/20" : "bg-paper dark:bg-surface-dark"
      }`}
    >
      <Text className="text-body text-ink-soft dark:text-ink-faint">{COPY[variant]}</Text>
      <Pressable onPress={() => Linking.openURL(url)}>
        <Text className="text-body font-extrabold text-ink underline">Open original ↗</Text>
      </Pressable>
      {variant === "failed" && onRetry && (
        <Pressable onPress={onRetry}>
          <Text className="text-body font-extrabold text-ink underline">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}
