import { useRouter } from "expo-router";
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
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState<ContentType | undefined>(undefined);
  const mutation = useCaptureContent();

  const handleSubmit = () => {
    mutation.mutate(
      { url, contentType },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <TextInput
          className="rounded-lg border border-gray-300 p-3 text-base"
          placeholder="https://example.com/article"
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
              className={`rounded-full border px-3 py-1 ${
                contentType === type ? "border-blue-600 bg-blue-600" : "border-gray-300"
              }`}
            >
              <Text className={contentType === type ? "text-white" : "text-gray-700"}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {mutation.isError && (
          <Text className="text-sm text-red-500">
            Couldn't save that link. Check the URL and try again.
          </Text>
        )}

        <Pressable
          className="rounded-lg bg-blue-600 p-3"
          disabled={!url || mutation.isPending}
          onPress={handleSubmit}
        >
          <Text className="text-center font-semibold text-white">
            {mutation.isPending ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
