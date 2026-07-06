import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ReaderBody } from "../../src/components/reader/ReaderBody";
import { ReaderHeader } from "../../src/components/reader/ReaderHeader";
import { ReaderStatusNotice } from "../../src/components/reader/ReaderStatusNotice";
import { ReaderSummary } from "../../src/components/reader/ReaderSummary";
import { useContentItem } from "../../src/hooks/useContentItem";

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useContentItem(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="p-4 text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="p-4 text-red-500">Not found</Text>
      </SafeAreaView>
    );
  }

  if (data.status === "pending" || data.status === "processing") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <ReaderHeader
            title={data.title}
            url={data.url}
            heroImage={data.heroImage}
            author={data.author}
            source={data.source}
            readingTime={data.readingTime}
          />
          <ReaderStatusNotice variant="preparing" url={data.url} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (data.status === "failed") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <ReaderHeader
            title={data.title}
            url={data.url}
            heroImage={data.heroImage}
            author={data.author}
            source={data.source}
            readingTime={data.readingTime}
          />
          <ReaderStatusNotice variant="failed" url={data.url} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <ReaderHeader
          title={data.title}
          url={data.url}
          heroImage={data.heroImage}
          author={data.author}
          source={data.source}
          readingTime={data.readingTime}
        />
        <ReaderSummary summary={data.summary} />
        <ReaderBody extractedText={data.extractedText} />
      </ScrollView>
    </SafeAreaView>
  );
}
