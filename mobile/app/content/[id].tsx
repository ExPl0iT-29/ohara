import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Linking, NativeScrollEvent, NativeSyntheticEvent, Text, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const readProgress = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const scrollable = event.contentSize.height - event.layoutMeasurement.height;
      readProgress.value = scrollable > 0 ? Math.min(1, Math.max(0, event.contentOffset.y / scrollable)) : 0;
    },
  });
  const progressStyle = useAnimatedStyle(() => ({ width: `${readProgress.value * 100}%` }));
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
        <Text className="p-6 font-ui text-body text-ink-soft dark:text-ink-faint">Opening…</Text>
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <View className="gap-2 p-6">
          <Text className="font-heading text-title text-ink dark:text-paper">This item isn't in your library</Text>
          <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">It may have been removed, or the backup it came from was incomplete.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        <IconButton glyph="←" accessibilityLabel="Back" onPress={() => router.back()} />
        <IconButton glyph="↗" accessibilityLabel="Open the original page" onPress={() => void Linking.openURL(data.url)} />
      </View>
      <View className="mx-4 h-1 overflow-hidden rounded-pill bg-raised dark:bg-raised-dark" importantForAccessibility="no-hide-descendants">
        <Animated.View className="h-full rounded-pill bg-brand dark:bg-brand-bright" style={progressStyle} />
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48, gap: 24 }}
        onContentSizeChange={handleContentSizeChange}
        onScroll={onScroll}
        scrollEventThrottle={16}
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
          <View className="gap-4 px-2">
            {data.description && (
              <Text className="font-reading text-reading text-ink-soft dark:text-ink-faint">{data.description}</Text>
            )}
            <View className="self-start">
              <Button pill variant="primary" label="Open original" onPress={() => Linking.openURL(data.url)} />
            </View>
          </View>
        )}
        {data.status === "ready" && !data.isStub && (
          <View className="px-2">
            <ReaderBody extractedText={data.extractedText} />
          </View>
        )}

        <Divider />

        <View className="gap-3 px-2">
          <Eyebrow label="Tags" />
          {data.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Tag key={tag} label={tag} onPress={() => handleRemoveTag(tag)} />
              ))}
            </View>
          )}
          <View className="flex-row items-center gap-2">
            <TextField
              shape="pillSmall"
              className="flex-1"
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="Add a tag"
              returnKeyType="done"
            />
            <Button size="sm" pill label="Add" onPress={handleAddTag} />
          </View>
        </View>

        {data.status === "ready" && (
          <View className="gap-3 px-2">
            <Eyebrow label="Highlights" />
            {data.highlights.length === 0 && (
              <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">
                Copy a passage you want to keep and save it here with a note.
              </Text>
            )}
            {data.highlights.map((highlight) => (
              <Notice key={highlight.id} tone="highlight" compact>
                <Text className={`font-reading text-body ${noticeText("highlight")}`}>“{highlight.quote}”</Text>
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

        <View className="self-start px-2">
          <Button pill label={data.archivedAt ? "Move back to library" : "Archive"} onPress={handleToggleArchive} />
        </View>
      </Animated.ScrollView>
    </Screen>
  );
}
