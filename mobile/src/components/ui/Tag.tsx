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
      className="flex-row items-center gap-1 rounded-pill bg-brand-light px-3 py-1.5 dark:bg-brand-deep"
    >
      <Text className="font-ui text-caption text-brand-dark dark:text-brand-bright">#{label}</Text>
      <Text className="font-ui text-caption text-brand-dark dark:text-brand-bright">×</Text>
    </Pressable>
  );
}
