import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { captureContent, findByUrl, type ContentType } from "../src/api/content";
import { useCaptureContent } from "../src/hooks/useCaptureContent";
import { BrutalButton } from "../src/components/ui/BrutalButton";

const CONTENT_TYPES: ContentType[] = [
  "blog",
  "website",
  "documentation",
  "pdf",
  "paper",
  "youtube",
  "github",
  "book",
  "tweet",
  "reddit",
  "other",
];

export default function CaptureScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { url: sharedUrl } = useLocalSearchParams<{ url?: string }>();
  const [url, setUrl] = useState(sharedUrl ?? "");
  const [contentType, setContentType] = useState<ContentType | undefined>(undefined);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const mutation = useCaptureContent();

  const lines = useMemo(
    () => url.split("\n").map((line) => line.trim()).filter(Boolean),
    [url],
  );
  const isBulk = lines.length > 1;
  const existing = !isBulk && lines[0] ? findByUrl(lines[0]) : null;

  const handleSubmit = async () => {
    if (isBulk) {
      setIsBulkSaving(true);
      for (const line of lines) {
        await captureContent(line);
      }
      setIsBulkSaving(false);
      void queryClient.invalidateQueries({ queryKey: ["content", "list"] });
      router.back();
      return;
    }
    mutation.mutate(
      { url: lines[0] ?? url, contentType },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <TextInput
          className="rounded-card border-3 border-ink bg-paper p-4 text-body text-ink dark:bg-surface-dark dark:text-paper"
          placeholder="https://example.com/article&#10;(paste multiple, one per line)"
          placeholderTextColor="#A8A29E"
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          value={url}
          onChangeText={setUrl}
        />

        {existing && (
          <View className="gap-2 rounded-card border-3 border-ink bg-accent-mintLight p-4">
            <Text className="text-body font-semibold text-ink dark:text-paper">Already saved.</Text>
            <Pressable onPress={() => router.replace(`/content/${existing.id}`)} className="self-start">
              <Text className="text-caption font-bold text-ink underline">Open existing item</Text>
            </Pressable>
          </View>
        )}

        {!isBulk && (
          <View className="flex-row flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setContentType(contentType === type ? undefined : type)}
                className={`rounded-pill border-3 border-ink px-3 py-1.5 ${
                  contentType === type ? "bg-brand" : "bg-paper dark:bg-surface-dark"
                }`}
              >
                <Text className="text-caption font-bold text-ink">{type}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {isBulk && (
          <Text className="text-caption text-ink-soft dark:text-ink-faint">
            {lines.length} links will be saved as "other" — open each individually to set its type.
          </Text>
        )}

        {mutation.isError && (
          <Text className="text-caption font-bold text-danger">
            Couldn't save that link. Check the URL and try again.
          </Text>
        )}

        <BrutalButton
          variant="primary"
          onPress={handleSubmit}
          disabled={lines.length === 0 || mutation.isPending || isBulkSaving || !!existing}
        >
          <Text className="text-center text-body font-extrabold text-ink">
            {mutation.isPending || isBulkSaving ? "Saving..." : isBulk ? `Save ${lines.length} links` : "Save"}
          </Text>
        </BrutalButton>
      </ScrollView>
    </SafeAreaView>
  );
}
