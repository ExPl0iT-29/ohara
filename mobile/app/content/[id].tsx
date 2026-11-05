import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import { Divider } from "../../src/components/ui/Divider";
import { Notice, noticeSoftText, noticeText } from "../../src/components/ui/Notice";
import { Tag } from "../../src/components/ui/Tag";
import { TextButton } from "../../src/components/ui/TextButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow } from "../../src/components/ui/Eyebrow";
import { IconButton } from "../../src/components/ui/IconButton";
import { Screen } from "../../src/components/ui/Screen";

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useContentItem(id);
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newNote, setNewNote] = useState("");
  const router = useRouter();
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
        <Text className="p-5 font-ui text-body text-ink-soft dark:text-ink-faint">Opening…</Text>
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <View className="gap-2 p-5">
          <Text className="font-heading text-title text-ink dark:text-paper">This item isn't in your library</Text>
          <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">It may have been removed, or the backup it came from was incomplete.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-5 pb-1 pt-2">
        <IconButton glyph="←" accessibilityLabel="Back" onPress={() => router.back()} />
        <IconButton glyph="↗" accessibilityLabel="Open the original page" onPress={() => void Linking.openURL(data.url)} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 22 }}
        onContentSizeChange={handleContentSizeChange}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <ReaderHeader
          title={data.title}
          url={data.url}
          heroImage={data.heroImage}
          author={data.author}
          source={data.source}
          readingTime={data.readingTime}
        />

        {(data.status === "pending" || data.status === "processing") && (
          <ReaderStatusNotice variant="preparing" url={data.url} />
        )}
        {data.status === "failed" && <ReaderStatusNotice variant="failed" url={data.url} onRetry={handleRetry} />}
        {data.status === "ready" && data.isStub && (
          <View className="gap-4">
            {data.description && (
              <Text className="font-reading text-reading text-ink-soft dark:text-ink-faint">{data.description}</Text>
            )}
            <View className="self-start">
              <Button pill variant="primary" label="Open original link" onPress={() => Linking.openURL(data.url)} />
            </View>
          </View>
        )}
        {data.status === "ready" && !data.isStub && <ReaderBody extractedText={data.extractedText} />}

        <Divider />

        <View className="gap-3">
          <Eyebrow label="Tags" />
          {data.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Tag key={tag} label={tag} onPress={() => handleRemoveTag(tag)} />
              ))}
            </View>
          )}
          <View className="flex-row items-center gap-3">
            <TextField
              shape="pillSmall"
              className="flex-1"
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="Add a tag"
              returnKeyType="done"
            />
            <TextButton label="Add" onPress={handleAddTag} />
          </View>
        </View>

        {data.status === "ready" && (
          <View className="gap-3">
            <Eyebrow label="Highlights" />
            {data.highlights.length === 0 && (
              <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">
                Copy a passage you want to keep and save it here with a note.
              </Text>
            )}
            {data.highlights.map((highlight) => (
              <Notice key={highlight.id} tone="highlight" compact>
                <Text className={`font-reading text-body italic ${noticeText("highlight")}`}>“{highlight.quote}”</Text>
                {highlight.note ? (
                  <Text className={`font-ui text-caption ${noticeSoftText("highlight")}`}>{highlight.note}</Text>
                ) : null}
                <TextButton label="Remove" tone="danger" onPress={() => handleRemoveHighlight(highlight.id)} />
              </Notice>
            ))}
            <TextField shape="box" value={newQuote} onChangeText={setNewQuote} placeholder="Quote" multiline />
            <TextField shape="box" value={newNote} onChangeText={setNewNote} placeholder="Note (optional)" multiline />
            <View className="self-start">
              <Button pill size="sm" variant="primary" label="Save highlight" onPress={handleAddHighlight} />
            </View>
          </View>
        )}

        <View className="self-start">
          <Button pill size="sm" label={data.archivedAt ? "Move back to library" : "Archive"} onPress={handleToggleArchive} />
        </View>
      </ScrollView>
    </Screen>
  );
}
