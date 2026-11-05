import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import type { ContentItem } from "../../api/content";
import { CONTENT_TYPE_LABELS } from "../../constants/contentTypeLabels";
import { minutesLabel, sourceLabel } from "../../format/itemMeta";
import { useTheme } from "../../theme/useTheme";
import { HardShadow } from "../ui/HardShadow";
import { FeedStatusBadge } from "./FeedStatusBadge";
import { typeSolid, typeTint } from "./typeColors";

interface FeedListItemProps {
  item: ContentItem;
  onPress: (id: string) => void;
  onToggleArchive?: (item: ContentItem) => void;
  /** The lead item gets a full card with an image band; the rest are compact rows. */
  featured?: boolean;
}

const ACTION_SIZE = 52;
const ACTION_GAP = 10;
const REVEAL_WIDTH = ACTION_SIZE * 3 + ACTION_GAP * 4;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;

function ActionButton({ label, accessibilityLabel, bg, onPress }: { label: string; accessibilityLabel: string; bg: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{ width: ACTION_SIZE, height: ACTION_SIZE, borderRadius: 16, borderWidth: 2.5, borderColor: colors.line, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}
    >
      <Text className="font-ui text-[11px] font-extrabold text-ink">{label}</Text>
    </Pressable>
  );
}

function TypePill({ item }: { item: ContentItem }) {
  return (
    <View className={`self-start rounded-pill border-2 border-line px-2 py-0.5 dark:border-line-dark ${typeTint(item.contentType)}`}>
      <Text className="font-ui text-[11px] font-extrabold uppercase leading-[14px] tracking-wide text-ink dark:text-paper">
        {CONTENT_TYPE_LABELS[item.contentType]}
        {item.scrollProgress && item.scrollProgress > 0.02 ? ` · ${Math.round(Math.min(1, item.scrollProgress) * 100)}%` : ""}
      </Text>
    </View>
  );
}

function Meta({ item }: { item: ContentItem }) {
  const text = [sourceLabel(item.url), minutesLabel(item)].filter(Boolean).join(" · ");
  return (
    <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint" numberOfLines={1}>
      {text}
    </Text>
  );
}

function FeaturedBody({ item }: { item: ContentItem }) {
  const progress = item.scrollProgress ?? 0;
  return (
    <View className="overflow-hidden rounded-[11.5px]">
      {item.heroImage ? (
        <Image source={{ uri: item.heroImage }} style={{ height: 120, width: "100%" }} contentFit="cover" cachePolicy="memory-disk" transition={150} />
      ) : (
        <View className={`h-16 ${typeSolid(item.contentType)}`} />
      )}
      <View className="h-0 border-t-2.5 border-line dark:border-line-dark" />
      <View className="gap-2 p-4">
        <TypePill item={item} />
        <Text className="font-heading text-title text-ink dark:text-paper" numberOfLines={3}>
          {item.title ?? item.url}
        </Text>
        <Meta item={item} />
        <FeedStatusBadge status={item.status} />
        {progress > 0.02 && (
          <View className="mt-1 h-2.5 overflow-hidden rounded-pill border-2 border-line dark:border-line-dark">
            <View className="h-full bg-brand" style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }} />
          </View>
        )}
      </View>
    </View>
  );
}

function CompactBody({ item }: { item: ContentItem }) {
  return (
    <View className="flex-row items-center gap-3 p-3">
      {item.heroImage ? (
        <Image source={{ uri: item.heroImage }} style={{ width: 44, height: 44, borderRadius: 10 }} contentFit="cover" cachePolicy="memory-disk" />
      ) : (
        <View className={`h-11 w-11 items-center justify-center rounded-[10px] border-2 border-line dark:border-line-dark ${typeSolid(item.contentType)}`}>
          <Text className="font-heading text-body font-extrabold text-ink">{CONTENT_TYPE_LABELS[item.contentType].charAt(0)}</Text>
        </View>
      )}
      <View className="flex-1 gap-0.5">
        <Text className="font-ui text-body font-bold text-ink dark:text-paper" numberOfLines={2}>
          {item.title ?? item.url}
        </Text>
        <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint" numberOfLines={1}>
          {[CONTENT_TYPE_LABELS[item.contentType], sourceLabel(item.url), minutesLabel(item)].filter(Boolean).join(" · ")}
        </Text>
        <FeedStatusBadge status={item.status} />
      </View>
    </View>
  );
}

function FeedListItemBase({ item, onPress, onToggleArchive, featured = false }: FeedListItemProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const isArchived = !!item.archivedAt;

  const closeSwipe = () => {
    translateX.value = withSpring(0);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-REVEAL_WIDTH, Math.min(0, event.translationX));
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value < -OPEN_THRESHOLD ? -REVEAL_WIDTH : 0);
    });

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const actionsStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, -translateX.value / OPEN_THRESHOLD) }));
  const offset = featured ? 4 : 3;

  return (
    <Animated.View entering={FadeInDown}>
      <View style={{ position: "relative" }}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            actionsStyle,
            { position: "absolute", top: 0, bottom: 0, right: 0, zIndex: 1, elevation: 1, flexDirection: "row", alignItems: "center", gap: ACTION_GAP, paddingRight: ACTION_GAP },
          ]}
        >
          <ActionButton label="OPEN" accessibilityLabel="Open" bg={colors.actionOpen} onPress={() => { closeSwipe(); onPress(item.id); }} />
          <ActionButton
            label={isArchived ? "BACK" : "DONE"}
            accessibilityLabel={isArchived ? "Unarchive" : "Archive"}
            bg={colors.actionArchive}
            onPress={() => { closeSwipe(); onToggleArchive?.(item); }}
          />
          <ActionButton
            label="SHARE"
            accessibilityLabel="Share"
            bg={colors.actionShare}
            onPress={() => { closeSwipe(); void Share.share({ message: item.url, url: item.url }); }}
          />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View style={[cardStyle, { zIndex: 2 }]}>
            <HardShadow offset={offset} radius={14}>
              <Pressable
                onPress={() => onPress(item.id)}
                accessibilityRole="button"
                className="rounded-card border-2.5 border-line bg-raised active:opacity-90 dark:border-line-dark dark:bg-raised-dark"
              >
                {featured ? <FeaturedBody item={item} /> : <CompactBody item={item} />}
              </Pressable>
            </HardShadow>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

export const FeedListItem = memo(FeedListItemBase);
