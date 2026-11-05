import { Pressable, Text } from "react-native";

type ChipTone = "brand" | "tag";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Content filters use brand; user tags use tag, shown with a leading #. */
  tone?: ChipTone;
  size?: "sm" | "md";
}

/** A selectable pill for filters and pickers. Selected chips fill with ink. */
export function Chip({ label, selected = false, onPress, tone = "brand", size = "sm" }: ChipProps) {
  const box = selected
    ? "border-ink bg-ink dark:border-paper dark:bg-paper"
    : "border-line bg-raised dark:border-line-dark dark:bg-raised-dark";
  const text = selected ? "text-paper dark:text-surface-dark" : "text-ink-soft dark:text-ink-faint";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-pill border ${size === "md" ? "px-4 py-2" : "px-3 py-1.5"} ${box}`}
    >
      <Text className={`font-ui text-caption ${text}`}>{tone === "tag" ? `#${label}` : label}</Text>
    </Pressable>
  );
}
