import { memo } from "react";
import { Text, View } from "react-native";

import type { ContentStatus } from "../../api/content";
import { STATUS_LABELS } from "../../constants/statusCopy";

interface FeedStatusBadgeProps {
  status: ContentStatus;
}

const TONE: Partial<Record<ContentStatus, { box: string; text: string }>> = {
  pending: { box: "bg-amber-light dark:bg-[#5C4300]", text: "text-amber dark:text-amber-bright" },
  processing: { box: "bg-amber-light dark:bg-[#5C4300]", text: "text-amber dark:text-amber-bright" },
  failed: { box: "bg-danger-light dark:bg-danger-deep", text: "text-danger dark:text-danger-bright" },
};

/** Small tonal label for items that are not ready to read. */
function FeedStatusBadgeBase({ status }: FeedStatusBadgeProps) {
  const label = STATUS_LABELS[status];
  const tone = TONE[status];
  if (!label || !tone) return null;

  return (
    <View className={`self-start rounded-[6px] px-2 py-0.5 ${tone.box}`}>
      <Text className={`font-ui text-[11px] font-semibold leading-[16px] ${tone.text}`}>{label}</Text>
    </View>
  );
}

export const FeedStatusBadge = memo(FeedStatusBadgeBase);
