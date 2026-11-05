import { Pressable, Text } from "react-native";

interface TagProps {
  label: string;
  onPress?: () => void;
}

/** A user tag on an item; pressing it removes the tag. */
export function Tag({ label, onPress }: TagProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Remove tag ${label}`}
      className="rounded-pill border-2 border-line bg-accent-violetLight px-3 py-1 dark:border-line-dark dark:bg-accent-violetDeep"
    >
      <Text className="font-ui text-caption font-bold text-ink dark:text-paper">#{label}  ×</Text>
    </Pressable>
  );
}
