import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
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

const ACTION_SIZE = 52;
const ACTION_GAP = 10;
const REVEAL_WIDTH = ACTION_SIZE * 3 + ACTION_GAP * 4;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;

function ActionButton({
  label,
  bg,
  onPress,
}: {
  label: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: ACTION_SIZE,
        height: ACTION_SIZE,
        borderRadius: ACTION_SIZE / 2,
        borderWidth: 3,
        borderColor: "#1C1917",
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className="text-caption font-extrabold text-ink">{label}</Text>
    </Pressable>
  );
}

function FeedListItemBase({ item, onPress, onToggleArchive }: FeedListItemProps) {
  const translateX = useSharedValue(0);
  const isArchived = !!item.archivedAt;

  const closeSwipe = () => {
    translateX.value = withSpring(0);
  };

  const handleOpen = () => {
    closeSwipe();
    onPress(item.id);
  };

  const handleArchiveToggle = () => {
    closeSwipe();
    onToggleArchive?.(item);
  };

  const handleShare = () => {
    closeSwipe();
    void Share.share({ message: item.url, url: item.url });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-REVEAL_WIDTH, Math.min(0, event.translationX));
    })
    .onEnd(() => {
      const shouldOpen = translateX.value < -OPEN_THRESHOLD;
      translateX.value = withSpring(shouldOpen ? -REVEAL_WIDTH : 0);
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, -translateX.value / OPEN_THRESHOLD),
  }));

  return (
    <Animated.View entering={FadeInDown}>
      <View style={{ position: "relative" }}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            actionsStyle,
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              zIndex: 1,
              elevation: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: ACTION_GAP,
              paddingRight: ACTION_GAP,
            },
          ]}
        >
          <ActionButton label="Open" bg="#5B8DEF" onPress={handleOpen} />
          <ActionButton
            label={isArchived ? "Unarc" : "Arc"}
            bg="#FFC933"
            onPress={handleArchiveToggle}
          />
          <ActionButton label="Share" bg="#34D399" onPress={handleShare} />
        </Animated.View>

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
          <Animated.View style={[cardStyle, { zIndex: 2 }]}>
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
                  <View className="self-start rounded-pill border-2 border-ink bg-accent-yellow px-2 py-0.5">
                    <Text className="text-caption font-bold text-ink">
                      {CONTENT_TYPE_LABELS[item.contentType]}
                    </Text>
                  </View>
                  <FeedStatusBadge status={item.status} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
