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
import { thumbnailShape, thumbnailTone } from "./shapes";

/** Where a row sits in its group; the group's outer corners are large, inner ones small. */
export type RowPosition = "single" | "first" | "middle" | "last";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
  onToggleArchive?: (item: ContentItem) => void;
  position?: RowPosition;
}

const ACTION_SIZE = 48;
const ACTION_GAP = 8;
const REVEAL_WIDTH = ACTION_SIZE * 3 + ACTION_GAP * 4;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;
const THUMB = 48;
const OUTER = 24;
const INNER = 6;

function cornerStyle(position: RowPosition) {
  const top = position === "single" || position === "first" ? OUTER : INNER;
  const bottom = position === "single" || position === "last" ? OUTER : INNER;
  return { borderTopLeftRadius: top, borderTopRightRadius: top, borderBottomLeftRadius: bottom, borderBottomRightRadius: bottom };
}

function ActionButton({ glyph, label, bg, onPress }: { glyph: string; label: string; bg: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: ACTION_SIZE, height: ACTION_SIZE, borderRadius: 16, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}
    >
      <Text className="font-ui text-[18px] text-ink dark:text-paper">{glyph}</Text>
    </Pressable>
  );
}

function Thumbnail({ item }: { item: ContentItem }) {
  const shape = thumbnailShape(item.contentType);
  if (item.heroImage) {
    return (
      <Image
        source={{ uri: item.heroImage }}
        style={[{ width: THUMB, height: THUMB }, shape]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
      />
    );
  }
  return (
    <View style={[{ width: THUMB, height: THUMB }, shape]} className={`items-center justify-center ${thumbnailTone(item.contentType)}`}>
      <Text className="font-ui text-body font-bold text-ink dark:text-paper">{CONTENT_TYPE_LABELS[item.contentType].charAt(0)}</Text>
    </View>
  );
}

function FeedListItemBase({ item, onPress, onToggleArchive, position = "single" }: FeedListItemProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const isArchived = !!item.archivedAt;

  const closeSwipe = () => {
    translateX.value = withSpring(0, { damping: 18 });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-REVEAL_WIDTH, Math.min(0, event.translationX));
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value < -OPEN_THRESHOLD ? -REVEAL_WIDTH : 0, { damping: 18 });
    });

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, -translateX.value / OPEN_THRESHOLD) }));

  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} className="mx-4" style={{ marginBottom: 3 }}>
      <View style={{ position: "relative" }}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            actionsStyle,
            { position: "absolute", top: 0, bottom: 0, right: 0, flexDirection: "row", alignItems: "center", gap: ACTION_GAP, paddingRight: ACTION_GAP },
          ]}
        >
          <ActionButton glyph="↗" label="Open" bg={colors.actionOpen} onPress={() => { closeSwipe(); onPress(item.id); }} />
          <ActionButton
            glyph={isArchived ? "↺" : "⇣"}
            label={isArchived ? "Unarchive" : "Archive"}
            bg={colors.actionArchive}
            onPress={() => { closeSwipe(); onToggleArchive?.(item); }}
          />
          <ActionButton
            glyph="⤴"
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
              style={cornerStyle(position)}
              className="flex-row items-center gap-4 bg-raised px-4 py-3.5 active:bg-raised-high dark:bg-raised-dark dark:active:bg-raised-highDark"
            >
              <Thumbnail item={item} />
              <View className="flex-1 gap-1">
                <Text className="font-ui text-body font-semibold text-ink dark:text-paper" numberOfLines={2}>
                  {item.title ?? item.url}
                </Text>
                <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint" numberOfLines={1}>
                  {metaLine(item)}
                </Text>
                <FeedStatusBadge status={item.status} />
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
