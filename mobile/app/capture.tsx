import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ContentType } from "../src/api/content";
import { useCaptureContent } from "../src/hooks/useCaptureContent";

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
  const { url: sharedUrl } = useLocalSearchParams<{ url?: string }>();
  const [url, setUrl] = useState(sharedUrl ?? "");
  const [contentType, setContentType] = useState<ContentType | undefined>(undefined);
  const mutation = useCaptureContent();

  const handleSubmit = () => {
    mutation.mutate(
      { url, contentType },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <TextInput
          className="rounded-card border border-line bg-white p-4 text-body text-ink"
          placeholder="https://example.com/article"
          placeholderTextColor="#A8A29E"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={url}
          onChangeText={setUrl}
        />

        <View className="flex-row flex-wrap gap-2">
          {CONTENT_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => setContentType(contentType === type ? undefined : type)}
              className={`rounded-pill border px-3 py-1.5 ${
                contentType === type ? "border-brand bg-brand" : "border-line bg-white"
              }`}
            >
              <Text className={contentType === type ? "text-caption text-white" : "text-caption text-ink-soft"}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {mutation.isError && (
          <Text className="text-caption text-danger">
            Couldn't save that link. Check the URL and try again.
          </Text>
        )}

        <Pressable
          className="rounded-card bg-brand p-4 active:opacity-80 disabled:opacity-40"
          disabled={!url || mutation.isPending}
          onPress={handleSubmit}
        >
          <Text className="text-center text-body font-semibold text-white">
            {mutation.isPending ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
