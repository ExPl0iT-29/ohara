import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { ContentItem } from "../../api/content";
import { CONTENT_TYPE_LABELS } from "../../constants/contentTypeLabels";
import { FeedStatusBadge } from "./FeedStatusBadge";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
  onToggleArchive?: (item: ContentItem) => void;
}

const SWIPE_THRESHOLD = 80;

function FeedListItemBase({ item, onPress, onToggleArchive }: FeedListItemProps) {
  const translateX = useSharedValue(0);
  const isArchived = !!item.archivedAt;

  const triggerToggle = () => onToggleArchive?.(item);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const passedLeftThreshold = !isArchived && event.translationX < -SWIPE_THRESHOLD;
      const passedRightThreshold = isArchived && event.translationX > SWIPE_THRESHOLD;
      if (passedLeftThreshold || passedRightThreshold) {
        runOnJS(triggerToggle)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View entering={FadeInDown}>
      <View style={{ position: "relative" }}>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            right: -4,
            bottom: -4,
            backgroundColor: "#1C1917",
            borderRadius: 16,
          }}
        />
        <GestureDetector gesture={pan}>
          <Animated.View style={animatedStyle}>
            <Pressable
              className="gap-2 rounded-card border-3 border-ink bg-paper p-4 active:opacity-90 dark:bg-surface-dark"
              onPress={() => onPress(item.id)}
            >
              <Text className="text-body font-bold text-ink dark:text-paper" numberOfLines={2}>
                {item.title ?? item.url}
              </Text>
              <Text className="text-caption text-ink-faint" numberOfLines={1}>
                {item.url}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="self-start rounded-pill border-2 border-ink bg-accent-yellow/50 px-2 py-0.5">
                    <Text className="text-caption font-bold text-ink">
                      {CONTENT_TYPE_LABELS[item.contentType]}
                    </Text>
                  </View>
                  <FeedStatusBadge status={item.status} />
                </View>
                {onToggleArchive ? (
                  <Pressable hitSlop={8} onPress={() => onToggleArchive(item)}>
                    <Text className="text-caption font-bold text-ink underline">
                      {isArchived ? "Unarchive" : "Archive"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
