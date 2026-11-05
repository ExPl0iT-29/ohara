import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { ContentItem } from "../../api/content";
import { metaLine } from "../../format/itemMeta";

interface ContinueCardProps {
  item: ContentItem;
  onPress: (id: string) => void;
}

/** Hero card for the most recent unfinished item, with a progress track. */
export function ContinueCard({ item, onPress }: ContinueCardProps) {
  const percent = Math.round(Math.min(1, item.scrollProgress ?? 0) * 100);
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`Continue reading ${item.title ?? item.url}, ${percent}% read`}
      className="mx-4 mb-4 flex-row items-center gap-4 rounded-[28px] bg-brand-light p-5 active:opacity-90 dark:bg-brand-deep"
    >
      <View className="flex-1 gap-2">
        <Text className="font-ui text-eyebrow text-brand dark:text-brand-onDeep">CONTINUE · {percent}%</Text>
        <Text className="font-ui text-title text-brand-dark dark:text-brand-onDeep" numberOfLines={2}>
          {item.title ?? item.url}
        </Text>
        <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint" numberOfLines={1}>
          {metaLine(item)}
        </Text>
        <View className="mt-1 h-1.5 overflow-hidden rounded-pill bg-white/60 dark:bg-black/30">
          <View className="h-full rounded-pill bg-brand dark:bg-brand-bright" style={{ width: `${percent}%` }} />
        </View>
      </View>
      {item.heroImage ? (
        <Image
          source={{ uri: item.heroImage }}
          style={{ width: 76, height: 76, borderTopLeftRadius: 38, borderBottomRightRadius: 38, borderTopRightRadius: 14, borderBottomLeftRadius: 14 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          style={{ width: 76, height: 76, borderTopLeftRadius: 38, borderBottomRightRadius: 38, borderTopRightRadius: 14, borderBottomLeftRadius: 14 }}
          className="bg-brand dark:bg-brand-bright"
        />
      )}
    </Pressable>
  );
}
