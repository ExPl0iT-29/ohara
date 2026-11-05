import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";

import { sourceLabel } from "../../format/itemMeta";

interface ReaderHeaderProps {
  title: string | null;
  url: string;
  heroImage: string | null;
  author: string | null;
  source: string;
  readingTime: number | null;
}

/** Tonal header card with source, title and facts, then the hero image. */
export function ReaderHeader({ title, url, heroImage, author, readingTime }: ReaderHeaderProps) {
  const openOriginal = () => void Linking.openURL(url);
  const facts = [readingTime ? `${readingTime} min read` : null, author].filter(Boolean) as string[];

  return (
    <View className="gap-3">
      <View className="gap-3 rounded-[28px] bg-brand-light p-5 dark:bg-brand-deep">
        <Text className="font-ui text-eyebrow text-brand dark:text-brand-onDeep">{sourceLabel(url).toUpperCase()}</Text>
        <Pressable onPress={openOriginal} accessibilityRole="link" accessibilityHint="Opens the original page">
          <Text className="font-heading text-[26px] font-extrabold leading-[32px] text-brand-dark dark:text-brand-onDeep">{title ?? url}</Text>
        </Pressable>
        {facts.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {facts.map((fact) => (
              <View key={fact} className="rounded-[8px] bg-paper px-2.5 py-1 dark:bg-surface-dark">
                <Text className="font-ui text-caption text-ink dark:text-paper">{fact}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {heroImage && (
        <Pressable onPress={openOriginal} accessibilityRole="imagebutton" accessibilityLabel="Hero image, opens the original page">
          <Image
            source={{ uri: heroImage }}
            style={{ height: 196, width: "100%", borderRadius: 28 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={220}
          />
        </Pressable>
      )}
    </View>
  );
}
