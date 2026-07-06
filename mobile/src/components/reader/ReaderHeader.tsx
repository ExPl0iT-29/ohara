import { Image, Text, View } from "react-native";

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
        <Image source={{ uri: heroImage }} className="h-48 w-full rounded-lg" resizeMode="cover" />
      )}
      <Text className="text-2xl font-bold leading-tight">{title ?? url}</Text>
      {byline.length > 0 && <Text className="text-sm text-gray-500">{byline}</Text>}
    </View>
  );
}
