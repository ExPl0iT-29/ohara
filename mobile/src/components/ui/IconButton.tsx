import { Pressable, Text } from "react-native";

interface IconButtonProps {
  glyph: string;
  accessibilityLabel: string;
  onPress: () => void;
}

/** Material 3 tonal icon button, 40dp round. */
export function IconButton({ glyph, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      className="h-10 w-10 items-center justify-center rounded-full bg-raised active:opacity-70 dark:bg-raised-dark"
    >
      <Text className="font-ui text-[18px] leading-[22px] text-ink dark:text-paper">{glyph}</Text>
    </Pressable>
  );
}
