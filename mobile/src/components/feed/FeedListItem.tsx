import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import type { ContentItem } from "../../api/content";
import { CONTENT_TYPE_LABELS } from "../../constants/contentTypeLabels";
import { metaLine } from "../../format/itemMeta";
import { useTheme } from "../../theme/useTheme";
import { FeedStatusBadge } from "./FeedStatusBadge";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
  onToggleArchive?: (item: ContentItem) => void;
}

const ACTION_WIDTH = 76;
const ACTION_GAP = 8;
const REVEAL_WIDTH = ACTION_WIDTH * 3 + ACTION_GAP * 4;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;
const THUMB = 64;

function ActionButton({ label, bg, onPress }: { label: string; bg: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: ACTION_WIDTH, height: 40, borderRadius: 20, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}
    >
      <Text className="font-ui text-caption text-white">{label}</Text>
    </Pressable>
  );
}

/** Square thumbnail: the hero image, or the content type's initial on a tint. */
function Thumbnail({ item }: { item: ContentItem }) {
  if (item.heroImage) {
    return (
      <Image
        source={{ uri: item.heroImage }}
        style={{ width: THUMB, height: THUMB, borderRadius: 8 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View
      style={{ width: THUMB, height: THUMB }}
      className="items-center justify-center rounded-lg bg-brand-light dark:bg-brand-deep"
    >
      <Text className="font-heading text-title text-brand dark:text-brand-bright">
        {CONTENT_TYPE_LABELS[item.contentType].charAt(0)}
      </Text>
    </View>
  );
}

function FeedListItemBase({ item, onPress, onToggleArchive }: FeedListItemProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const isArchived = !!item.archivedAt;
  const progress = item.scrollProgress ?? 0;

  const closeSwipe = () => {
    translateX.value = withSpring(0, { damping: 20 });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-REVEAL_WIDTH, Math.min(0, event.translationX));
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value < -OPEN_THRESHOLD ? -REVEAL_WIDTH : 0, { damping: 20 });
    });

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, -translateX.value / OPEN_THRESHOLD) }));

  return (
    <Animated.View entering={FadeInDown.duration(220)}>
      <View style={{ position: "relative" }}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            actionsStyle,
            { position: "absolute", top: 0, bottom: 0, right: 0, flexDirection: "row", alignItems: "center", gap: ACTION_GAP, paddingRight: ACTION_GAP },
          ]}
        >
          <ActionButton label="Open" bg={colors.actionOpen} onPress={() => { closeSwipe(); onPress(item.id); }} />
          <ActionButton
            label={isArchived ? "Restore" : "Archive"}
            bg={colors.actionArchive}
            onPress={() => { closeSwipe(); onToggleArchive?.(item); }}
          />
          <ActionButton
            label="Share"
            bg={colors.actionShare}
            onPress={() => { closeSwipe(); void Share.share({ message: item.url, url: item.url }); }}
          />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View style={rowStyle}>
            <Pressable
              onPress={() => onPress(item.id)}
              accessibilityRole="button"
              className="flex-row gap-4 border-b border-line bg-paper px-5 py-4 active:bg-raised dark:border-line-dark dark:bg-surface-dark dark:active:bg-raised-dark"
            >
              <View className="flex-1 gap-1.5">
                <Text className="font-heading text-[17px] leading-[23px] text-ink dark:text-paper" numberOfLines={2}>
                  {item.title ?? item.url}
                </Text>
                <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint" numberOfLines={1}>
                  {metaLine(item)}
                </Text>
                <FeedStatusBadge status={item.status} />
                {progress > 0.02 && (
                  <View className="mt-1 h-0.5 overflow-hidden rounded-full bg-line dark:bg-line-dark">
                    <View className="h-full rounded-full bg-brand dark:bg-brand-bright" style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }} />
                  </View>
                )}
              </View>
              <Thumbnail item={item} />
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
