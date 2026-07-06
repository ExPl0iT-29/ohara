import { Linking, Pressable, Text, View } from "react-native";

interface ReaderStatusNoticeProps {
  variant: "preparing" | "failed";
  url: string;
}

const COPY = {
  preparing: "This item is still being prepared — check back shortly.",
  failed: "This item couldn't be fully processed. You can still open the original.",
};

export function ReaderStatusNotice({ variant, url }: ReaderStatusNoticeProps) {
  return (
    <View className="gap-3 rounded-lg bg-gray-50 p-4">
      <Text className="text-base text-gray-600">{COPY[variant]}</Text>
      <Pressable onPress={() => Linking.openURL(url)}>
        <Text className="font-semibold text-blue-600">Open original ↗</Text>
      </Pressable>
    </View>
  );
}
