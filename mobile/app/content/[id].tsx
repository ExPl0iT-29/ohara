import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
import { useContentItem } from "../../src/hooks/useContentItem";
import { Button } from "../../src/components/ui/Button";
import { Tag } from "../../src/components/ui/Tag";
import { TextField } from "../../src/components/ui/TextField";
import { Screen } from "../../src/components/ui/Screen";

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
      <Screen>
        <Text className="font-ui p-5 text-body text-ink-soft dark:text-ink-faint">Loading...</Text>
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <Text className="font-ui p-5 text-body text-danger">Not found</Text>
      </Screen>
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
    <Screen>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20, gap: 20 }}
        onContentSizeChange={handleContentSizeChange}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {header}
        <Button pill onPress={handleToggleArchive} className="self-start px-3 py-1.5">
          <Text className="font-ui text-caption font-bold text-ink">
            {data.archivedAt ? "Unarchive" : "Archive"}
          </Text>
        </Button>

        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Tag key={tag} label={tag} onPress={() => handleRemoveTag(tag)} />
            ))}
          </View>
          <View className="flex-row gap-2">
            <TextField
              shape="pillSmall"
              className="flex-1"
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="Add tag"
            />
            <Pressable onPress={handleAddTag} className="justify-center px-2">
              <Text className="font-ui text-caption font-bold text-ink underline">Add</Text>
            </Pressable>
          </View>
        </View>

        {(data.status === "pending" || data.status === "processing") && (
          <ReaderStatusNotice variant="preparing" url={data.url} />
        )}
        {data.status === "failed" && (
          <ReaderStatusNotice variant="failed" url={data.url} onRetry={handleRetry} />
        )}
        {data.status === "ready" && data.isStub && (
          <View className="gap-4">
            {data.description && (
              <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">{data.description}</Text>
            )}
            <Button pill variant="primary" onPress={() => Linking.openURL(data.url)}>
              <Text className="font-ui text-caption font-extrabold text-ink">Open original link</Text>
            </Button>
          </View>
        )}
        {data.status === "ready" && !data.isStub && (
          <>
            <ReaderBody extractedText={data.extractedText} />
          </>
        )}
        {data.status === "ready" && (
          <View className="gap-3 border-t-3 border-ink pt-4">
            <Text className="font-ui text-body font-semibold text-ink dark:text-paper">Highlights</Text>
            {data.highlights.map((highlight) => (
              <View
                key={highlight.id}
                className="gap-1 rounded-card border-3 border-ink bg-accent-yellowLight p-3"
              >
                <Text className="font-ui text-body italic text-ink dark:text-paper">"{highlight.quote}"</Text>
                {highlight.note ? (
                  <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">{highlight.note}</Text>
                ) : null}
                <Pressable onPress={() => handleRemoveHighlight(highlight.id)} className="self-start">
                  <Text className="font-ui text-caption font-bold text-danger">Remove</Text>
                </Pressable>
              </View>
            ))}
            <TextField shape="box" value={newQuote} onChangeText={setNewQuote} placeholder="Quote" multiline />
            <TextField shape="box" value={newNote} onChangeText={setNewNote} placeholder="Note (optional)" multiline />
            <Button pill variant="primary" onPress={handleAddHighlight} className="self-start">
              <Text className="font-ui text-caption font-extrabold text-ink">Save highlight</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
