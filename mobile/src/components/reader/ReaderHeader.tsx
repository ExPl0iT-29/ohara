import { Image } from "expo-image";
import { Linking, Pressable, Text, View } from "react-native";

interface ReaderHeaderProps {
  title: string | null;
  url: string;
  heroImage: string | null;
  author: string | null;
  source: string;
  readingTime: number | null;
}

export function ReaderHeader({
  title,
  url,
  heroImage,
  author,
  source,
  readingTime,
}: ReaderHeaderProps) {
  const byline = [author, source, readingTime ? `${readingTime} min read` : null]
    .filter(Boolean)
    .join(" · ");
  const openOriginal = () => void Linking.openURL(url);

  return (
    <View className="gap-3">
      {heroImage && (
        <Pressable onPress={openOriginal}>
          <Image
            source={{ uri: heroImage }}
            style={{ height: 192, width: "100%", borderRadius: 8 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
          />
        </Pressable>
      )}
      <Pressable onPress={openOriginal}>
        <Text className="text-display text-ink dark:text-paper">{title ?? url}</Text>
      </Pressable>
      {byline.length > 0 && <Text className="text-caption text-ink-faint">{byline}</Text>}
    </View>
  );
}
