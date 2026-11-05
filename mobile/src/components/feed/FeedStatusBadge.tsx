import { memo } from "react";
import { Text, View } from "react-native";

import type { ContentStatus } from "../../api/content";
import { STATUS_LABELS } from "../../constants/statusCopy";

interface FeedStatusBadgeProps {
  status: ContentStatus;
}

const TONE: Partial<Record<ContentStatus, { dot: string; text: string }>> = {
  pending: { dot: "bg-amber dark:bg-amber-bright", text: "text-amber dark:text-amber-bright" },
  processing: { dot: "bg-amber dark:bg-amber-bright", text: "text-amber dark:text-amber-bright" },
  failed: { dot: "bg-danger dark:bg-danger-bright", text: "text-danger dark:text-danger-bright" },
};

/** A quiet coloured dot and label for items that are not ready to read. */
function FeedStatusBadgeBase({ status }: FeedStatusBadgeProps) {
  const label = STATUS_LABELS[status];
  const tone = TONE[status];
  if (!label || !tone) return null;

  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      <Text className={`font-ui text-caption ${tone.text}`}>{label}</Text>
    </View>
  );
}

export const FeedStatusBadge = memo(FeedStatusBadgeBase);
