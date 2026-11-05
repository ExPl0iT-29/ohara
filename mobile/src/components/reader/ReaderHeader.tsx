import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";

import { sourceLabel } from "../../format/itemMeta";
import { Eyebrow } from "../ui/Eyebrow";

interface ReaderHeaderProps {
  title: string | null;
  url: string;
  heroImage: string | null;
  author: string | null;
  source: string;
  readingTime: number | null;
}

/** Source, title and byline, then the hero image. Tapping the title opens the original. */
export function ReaderHeader({ title, url, heroImage, author, readingTime }: ReaderHeaderProps) {
  const byline = [author, readingTime ? `${readingTime} min read` : null].filter(Boolean).join(" · ");
  const openOriginal = () => void Linking.openURL(url);

  return (
    <View className="gap-4">
      <View className="gap-3">
        <Eyebrow label={sourceLabel(url)} tone="accent" />
        <Pressable onPress={openOriginal} accessibilityRole="link" accessibilityHint="Opens the original page">
          <Text className="font-heading text-display text-ink dark:text-paper">{title ?? url}</Text>
        </Pressable>
        {byline.length > 0 && <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">{byline}</Text>}
      </View>
      {heroImage && (
        <Pressable onPress={openOriginal} accessibilityRole="imagebutton" accessibilityLabel="Hero image, opens the original page">
          <Image
            source={{ uri: heroImage }}
            style={{ height: 200, width: "100%", borderRadius: 12 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
        </Pressable>
      )}
    </View>
  );
}
