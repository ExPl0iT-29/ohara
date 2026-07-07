import { Linking, Pressable, Text, View } from "react-native";

interface ReaderStatusNoticeProps {
  variant: "preparing" | "failed";
  url: string;
}

const COPY = {
  preparing: "This item is still being prepared — check back shortly.",
  failed: "This item couldn't be fully processed. You can still open the original.",
};

export function ReaderStatusNotice({ variant, url }: ReaderStatusNoticeProps) {
  return (
    <View
      className={`gap-3 rounded-card border p-4 ${
        variant === "failed" ? "border-danger-light bg-danger-light/40" : "border-line bg-white"
      }`}
    >
      <Text className="text-body text-ink-soft">{COPY[variant]}</Text>
      <Pressable onPress={() => Linking.openURL(url)}>
        <Text className="text-body font-semibold text-brand">Open original ↗</Text>
      </Pressable>
    </View>
  );
}
