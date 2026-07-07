import { memo } from "react";
import { Text } from "react-native";

import type { ContentStatus } from "../../api/content";
import { STATUS_LABELS } from "../../constants/statusCopy";

interface FeedStatusBadgeProps {
  status: ContentStatus;
}

function FeedStatusBadgeBase({ status }: FeedStatusBadgeProps) {
  const label = STATUS_LABELS[status];
  if (!label) return null;

  return <Text className="text-sm text-gray-500">{label}</Text>;
}

export const FeedStatusBadge = memo(FeedStatusBadgeBase);
