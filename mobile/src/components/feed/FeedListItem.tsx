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
      <Pressable
        className="gap-2 rounded-card border border-line bg-white p-4 active:opacity-70"
        onPress={() => onPress(item.id)}
      >
        <Text className="text-body font-semibold text-ink" numberOfLines={2}>
          {item.title ?? item.url}
        </Text>
        <Text className="text-caption text-ink-faint" numberOfLines={1}>
          {item.url}
        </Text>
        <FeedStatusBadge status={item.status} />
      </Pressable>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
