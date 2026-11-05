import { Pressable, Text } from "react-native";

interface TagProps {
  label: string;
  onPress?: () => void;
}

/** Material 3 input chip for a user tag; pressing it removes the tag. */
export function Tag({ label, onPress }: TagProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Remove tag ${label}`}
      className="h-8 flex-row items-center gap-2 rounded-[8px] bg-raised-high px-3 dark:bg-raised-highDark"
    >
      <Text className="font-ui text-caption text-ink dark:text-paper">#{label}</Text>
      <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">✕</Text>
    </Pressable>
  );
}
