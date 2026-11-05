import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { captureContent, findByUrl, type ContentType } from "../src/api/content";
import { useCaptureContent } from "../src/hooks/useCaptureContent";
import { Button } from "../src/components/ui/Button";
import { Chip } from "../src/components/ui/Chip";
import { TextField } from "../src/components/ui/TextField";
import { Screen } from "../src/components/ui/Screen";

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
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <TextField
          shape="box"
          className="p-4"
          placeholder="https://example.com/article&#10;(paste multiple, one per line)"
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          value={url}
          onChangeText={setUrl}
        />

        {existing && (
          <View className="gap-2 rounded-card border-3 border-ink bg-accent-mintLight p-4">
            <Text className="font-ui text-body font-semibold text-ink dark:text-paper">Already saved.</Text>
            <Pressable onPress={() => router.replace(`/content/${existing.id}`)} className="self-start">
              <Text className="font-ui text-caption font-bold text-ink underline">Open existing item</Text>
            </Pressable>
          </View>
        )}

        {!isBulk && (
          <View className="flex-row flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => (
              <Chip
                key={type}
                size="md"
                label={type}
                selected={contentType === type}
                onPress={() => setContentType(contentType === type ? undefined : type)}
              />
            ))}
          </View>
        )}

        {isBulk && (
          <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">
            {lines.length} links will be saved as "other" — open each individually to set its type.
          </Text>
        )}

        {mutation.isError && (
          <Text className="font-ui text-caption font-bold text-danger">
            Couldn't save that link. Check the URL and try again.
          </Text>
        )}

        <Button
          variant="primary"
          onPress={handleSubmit}
          disabled={lines.length === 0 || mutation.isPending || isBulkSaving || !!existing}
        >
          <Text className="font-ui text-center text-body font-extrabold text-ink">
            {mutation.isPending || isBulkSaving ? "Saving..." : isBulk ? `Save ${lines.length} links` : "Save"}
          </Text>
        </Button>
      </ScrollView>
    </Screen>
  );
}
