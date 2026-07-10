import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import type { ContentItem } from "../../api/content";
import { CONTENT_TYPE_LABELS } from "../../constants/contentTypeLabels";
import { FeedStatusBadge } from "./FeedStatusBadge";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
  onToggleArchive?: (item: ContentItem) => void;
}

function FeedListItemBase({ item, onPress, onToggleArchive }: FeedListItemProps) {
  return (
    <Animated.View entering={FadeInDown}>
      <Pressable
        className="gap-2 rounded-card border border-line bg-white p-4 active:opacity-70 dark:border-ink-soft dark:bg-surface-dark"
        onPress={() => onPress(item.id)}
      >
        <Text className="text-body font-semibold text-ink dark:text-paper" numberOfLines={2}>
          {item.title ?? item.url}
        </Text>
        <Text className="text-caption text-ink-faint" numberOfLines={1}>
          {item.url}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="self-start rounded-pill bg-line/60 px-2 py-0.5 dark:bg-ink-soft/40">
              <Text className="text-caption font-medium text-ink-soft dark:text-ink-faint">
                {CONTENT_TYPE_LABELS[item.contentType]}
              </Text>
            </View>
            <FeedStatusBadge status={item.status} />
          </View>
          {onToggleArchive ? (
            <Pressable hitSlop={8} onPress={() => onToggleArchive(item)}>
              <Text className="text-caption text-ink-soft dark:text-ink-faint">
                {item.archivedAt ? "Unarchive" : "Archive"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
