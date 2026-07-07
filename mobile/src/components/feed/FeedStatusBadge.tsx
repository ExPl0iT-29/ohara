import { memo } from "react";
import { Text, View } from "react-native";

import type { ContentStatus } from "../../api/content";
import { STATUS_LABELS } from "../../constants/statusCopy";

interface FeedStatusBadgeProps {
  status: ContentStatus;
}

const BADGE_STYLES: Partial<Record<ContentStatus, string>> = {
  pending: "bg-amber-light",
  processing: "bg-amber-light",
  failed: "bg-danger-light",
};

const BADGE_TEXT_STYLES: Partial<Record<ContentStatus, string>> = {
  pending: "text-amber",
  processing: "text-amber",
  failed: "text-danger",
};

function FeedStatusBadgeBase({ status }: FeedStatusBadgeProps) {
  const label = STATUS_LABELS[status];
  if (!label) return null;

  return (
    <View className={`self-start rounded-pill px-2 py-0.5 ${BADGE_STYLES[status]}`}>
      <Text className={`text-caption font-medium ${BADGE_TEXT_STYLES[status]}`}>{label}</Text>
    </View>
  );
}

export const FeedStatusBadge = memo(FeedStatusBadgeBase);
