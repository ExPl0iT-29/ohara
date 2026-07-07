import { memo } from "react";
import { Pressable, Text } from "react-native";

import type { ContentItem } from "../../api/content";
import { FeedStatusBadge } from "./FeedStatusBadge";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
}

function FeedListItemBase({ item, onPress }: FeedListItemProps) {
  return (
    <Pressable className="rounded-lg border border-gray-200 p-3" onPress={() => onPress(item.id)}>
      <Text className="font-semibold">{item.title ?? item.url}</Text>
      <FeedStatusBadge status={item.status} />
    </Pressable>
  );
}

export const FeedListItem = memo(FeedListItemBase);
