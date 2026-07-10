import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { addTag, archiveContent, removeTag, unarchiveContent } from "../../src/api/content";
import { ReaderBody } from "../../src/components/reader/ReaderBody";
import { ReaderHeader } from "../../src/components/reader/ReaderHeader";
import { ReaderStatusNotice } from "../../src/components/reader/ReaderStatusNotice";
import { ReaderSummary } from "../../src/components/reader/ReaderSummary";
import { useContentItem } from "../../src/hooks/useContentItem";

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useContentItem(id);
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["content"] });

  const handleToggleArchive = () => {
    if (!data) return;
    if (data.archivedAt) {
      unarchiveContent(data.id);
    } else {
      archiveContent(data.id);
    }
    invalidate();
  };

  const handleAddTag = () => {
    if (!data || !newTag.trim()) return;
    addTag(data.id, newTag.trim());
    setNewTag("");
    invalidate();
  };

  const handleRemoveTag = (tag: string) => {
    if (!data) return;
    removeTag(data.id, tag);
    invalidate();
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

        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => handleRemoveTag(tag)}
                className="rounded-pill border border-line px-3 py-1 dark:border-ink-soft"
              >
                <Text className="text-caption text-ink-soft dark:text-ink-faint">{tag} ×</Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row gap-2">
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="Add tag"
              placeholderTextColor="#A8A29E"
              className="flex-1 rounded-pill border border-line px-3 py-1.5 text-caption text-ink dark:border-ink-soft dark:text-paper"
            />
            <Pressable onPress={handleAddTag} className="justify-center px-2">
              <Text className="text-caption font-semibold text-brand">Add</Text>
            </Pressable>
          </View>
        </View>

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
