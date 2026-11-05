import { Pressable, Text } from "react-native";

import { HardShadow } from "./HardShadow";

interface IconButtonProps {
  glyph: string;
  accessibilityLabel: string;
  onPress: () => void;
}

/** A square 40dp button with a glyph, on a small hard shadow. */
export function IconButton({ glyph, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <HardShadow offset={2} radius={12}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={6}
        className="h-10 w-10 items-center justify-center rounded-xl border-2.5 border-line bg-raised active:opacity-80 dark:border-line-dark dark:bg-raised-dark"
      >
        <Text className="font-ui text-[17px] font-extrabold leading-[20px] text-ink dark:text-paper">{glyph}</Text>
      </Pressable>
    </HardShadow>
  );
}
