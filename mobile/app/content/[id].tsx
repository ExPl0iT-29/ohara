import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { archiveContent, unarchiveContent } from "../../src/api/content";
import { ReaderBody } from "../../src/components/reader/ReaderBody";
import { ReaderHeader } from "../../src/components/reader/ReaderHeader";
import { ReaderStatusNotice } from "../../src/components/reader/ReaderStatusNotice";
import { ReaderSummary } from "../../src/components/reader/ReaderSummary";
import { useContentItem } from "../../src/hooks/useContentItem";

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useContentItem(id);
  const queryClient = useQueryClient();

  const handleToggleArchive = () => {
    if (!data) return;
    if (data.archivedAt) {
      unarchiveContent(data.id);
    } else {
      archiveContent(data.id);
    }
    void queryClient.invalidateQueries({ queryKey: ["content"] });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
        <Text className="p-5 text-body text-ink-soft dark:text-ink-faint">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
        <Text className="p-5 text-body text-danger">Not found</Text>
      </SafeAreaView>
    );
  }

  const header = (
    <ReaderHeader
      title={data.title}
      url={data.url}
      heroImage={data.heroImage}
      author={data.author}
      source={data.source}
      readingTime={data.readingTime}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {header}
        <Pressable onPress={handleToggleArchive} className="self-start">
          <Text className="text-caption font-semibold text-brand">
            {data.archivedAt ? "Unarchive" : "Archive"}
          </Text>
        </Pressable>
        {(data.status === "pending" || data.status === "processing") && (
          <ReaderStatusNotice variant="preparing" url={data.url} />
        )}
        {data.status === "failed" && <ReaderStatusNotice variant="failed" url={data.url} />}
        {data.status === "ready" && (
          <>
            <ReaderSummary summary={data.summary} />
            <ReaderBody extractedText={data.extractedText} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
