import { Linking, Text } from "react-native";

import { Notice, noticeSoftText } from "../ui/Notice";
import { TextButton } from "../ui/TextButton";

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
  const tone = variant === "failed" ? "danger" : "neutral";
  return (
    <Notice tone={tone}>
      <Text className={`font-ui text-body ${noticeSoftText(tone)}`}>{COPY[variant]}</Text>
      <TextButton size="md" label="Open original ↗" onPress={() => void Linking.openURL(url)} />
      {variant === "failed" && onRetry && <TextButton size="md" label="Retry" onPress={onRetry} />}
    </Notice>
  );
}
