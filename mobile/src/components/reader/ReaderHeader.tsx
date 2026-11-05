import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";

import { sourceLabel } from "../../format/itemMeta";
import { HardShadow } from "../ui/HardShadow";

interface ReaderHeaderProps {
  title: string | null;
  url: string;
  heroImage: string | null;
  author: string | null;
  source: string;
  readingTime: number | null;
}

/** Bordered hero image, source pill, heavy title and byline. */
export function ReaderHeader({ title, url, heroImage, author, readingTime }: ReaderHeaderProps) {
  const byline = [author, readingTime ? `${readingTime} min read` : null].filter(Boolean).join(" · ");
  const openOriginal = () => void Linking.openURL(url);

  return (
    <View className="gap-4">
      {heroImage && (
        <HardShadow radius={14}>
          <Pressable
            onPress={openOriginal}
            accessibilityRole="imagebutton"
            accessibilityLabel="Hero image, opens the original page"
            className="overflow-hidden rounded-card border-2.5 border-line dark:border-line-dark"
          >
            <Image source={{ uri: heroImage }} style={{ height: 180, width: "100%" }} contentFit="cover" cachePolicy="memory-disk" transition={150} />
          </Pressable>
        </HardShadow>
      )}
      <View className="self-start rounded-pill border-2 border-line bg-accent-pinkLight px-2.5 py-0.5 dark:border-line-dark dark:bg-accent-pinkDeep">
        <Text className="font-ui text-eyebrow uppercase text-ink dark:text-paper">{sourceLabel(url)}</Text>
      </View>
      <Pressable onPress={openOriginal} accessibilityRole="link" accessibilityHint="Opens the original page">
        <Text className="font-heading text-display text-ink dark:text-paper">{title ?? url}</Text>
      </Pressable>
      {byline.length > 0 && <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">{byline}</Text>}
    </View>
  );
}
