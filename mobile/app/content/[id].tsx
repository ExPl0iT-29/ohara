import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  addHighlight,
  addTag,
  archiveContent,
  removeHighlight,
  removeTag,
  retryContent,
  saveScrollProgress,
  unarchiveContent,
} from "../../src/api/content";
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
  const [newQuote, setNewQuote] = useState("");
  const [newNote, setNewNote] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const contentHeightRef = useRef(0);
  const hasRestoredRef = useRef(false);

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["content"] });

  const handleRetry = () => {
    if (!data) return;
    retryContent(data.id);
    invalidate();
  };

  const handleContentSizeChange = (_width: number, height: number) => {
    contentHeightRef.current = height;
    if (hasRestoredRef.current) return;
    if (data?.scrollProgress) {
      scrollViewRef.current?.scrollTo({ y: data.scrollProgress * height, animated: false });
    }
    hasRestoredRef.current = true;
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!data || !contentHeightRef.current) return;
    const progress = event.nativeEvent.contentOffset.y / contentHeightRef.current;
    saveScrollProgress(data.id, Math.max(0, Math.min(1, progress)));
  };

  const handleAddHighlight = () => {
    if (!data || !newQuote.trim()) return;
    addHighlight(data.id, newQuote.trim(), newNote.trim() || undefined);
    setNewQuote("");
    setNewNote("");
    invalidate();
  };

  const handleRemoveHighlight = (highlightId: string) => {
    if (!data) return;
    removeHighlight(data.id, highlightId);
    invalidate();
  };

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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20, gap: 20 }}
        onContentSizeChange={handleContentSizeChange}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
      >
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
        {data.status === "failed" && (
          <ReaderStatusNotice variant="failed" url={data.url} onRetry={handleRetry} />
        )}
        {data.status === "ready" && (
          <>
            <ReaderSummary summary={data.summary} />
            <ReaderBody extractedText={data.extractedText} />

            <View className="gap-3 border-t border-line pt-4 dark:border-ink-soft">
              <Text className="text-body font-semibold text-ink dark:text-paper">Highlights</Text>
              {data.highlights.map((highlight) => (
                <View
                  key={highlight.id}
                  className="gap-1 rounded-card border border-line p-3 dark:border-ink-soft"
                >
                  <Text className="text-body italic text-ink dark:text-paper">"{highlight.quote}"</Text>
                  {highlight.note ? (
                    <Text className="text-caption text-ink-soft dark:text-ink-faint">{highlight.note}</Text>
                  ) : null}
                  <Pressable onPress={() => handleRemoveHighlight(highlight.id)} className="self-start">
                    <Text className="text-caption text-danger">Remove</Text>
                  </Pressable>
                </View>
              ))}
              <TextInput
                value={newQuote}
                onChangeText={setNewQuote}
                placeholder="Quote"
                placeholderTextColor="#A8A29E"
                multiline
                className="rounded-card border border-line p-3 text-body text-ink dark:border-ink-soft dark:text-paper"
              />
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Note (optional)"
                placeholderTextColor="#A8A29E"
                multiline
                className="rounded-card border border-line p-3 text-body text-ink dark:border-ink-soft dark:text-paper"
              />
              <Pressable
                onPress={handleAddHighlight}
                className="self-start rounded-pill bg-brand px-4 py-2"
              >
                <Text className="text-caption font-semibold text-white">Save highlight</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
