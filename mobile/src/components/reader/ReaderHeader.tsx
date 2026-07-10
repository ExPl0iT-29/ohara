import { Image } from "expo-image";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

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

  return (
    <View className="gap-3">
      {heroImage && (
        <Animated.View entering={FadeIn}>
          <Image
            source={{ uri: heroImage }}
            style={{ height: 192, width: "100%", borderRadius: 8 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
          />
        </Animated.View>
      )}
      <Text className="text-display text-ink dark:text-paper">{title ?? url}</Text>
      {byline.length > 0 && <Text className="text-caption text-ink-faint">{byline}</Text>}
    </View>
  );
}
