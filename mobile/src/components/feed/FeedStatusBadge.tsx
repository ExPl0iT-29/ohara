import { memo } from "react";
import { Text, View } from "react-native";

import type { ContentStatus } from "../../api/content";
import { STATUS_LABELS } from "../../constants/statusCopy";

interface FeedStatusBadgeProps {
  status: ContentStatus;
}

const BADGE_BG: Partial<Record<ContentStatus, string>> = {
  pending: "bg-amber-light dark:bg-accent-yellowDeep",
  processing: "bg-amber-light dark:bg-accent-yellowDeep",
  failed: "bg-danger-light dark:bg-danger-deep",
};

/** Pill for items that are not ready to read. */
function FeedStatusBadgeBase({ status }: FeedStatusBadgeProps) {
  const label = STATUS_LABELS[status];
  if (!label) return null;

  return (
    <View className={`self-start rounded-pill border-2 border-line px-2 py-0.5 dark:border-line-dark ${BADGE_BG[status] ?? ""}`}>
      <Text className="font-ui text-caption font-bold text-ink dark:text-paper">{label}</Text>
    </View>
  );
}

export const FeedStatusBadge = memo(FeedStatusBadgeBase);
