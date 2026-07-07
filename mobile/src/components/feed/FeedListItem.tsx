import { memo } from "react";
import { Pressable, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import type { ContentItem } from "../../api/content";
import { FeedStatusBadge } from "./FeedStatusBadge";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
}

function FeedListItemBase({ item, onPress }: FeedListItemProps) {
  return (
    <Animated.View entering={FadeInDown}>
      <Pressable className="rounded-lg border border-gray-200 p-3" onPress={() => onPress(item.id)}>
        <Text className="font-semibold">{item.title ?? item.url}</Text>
        <FeedStatusBadge status={item.status} />
      </Pressable>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
