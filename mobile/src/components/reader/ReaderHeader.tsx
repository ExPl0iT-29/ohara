import { Image } from "expo-image";
import { Text, View } from "react-native";

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
        <Image
          source={{ uri: heroImage }}
          style={{ height: 192, width: "100%", borderRadius: 8 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={150}
        />
      )}
      <Text className="text-2xl font-bold leading-tight">{title ?? url}</Text>
      {byline.length > 0 && <Text className="text-sm text-gray-500">{byline}</Text>}
    </View>
  );
}
