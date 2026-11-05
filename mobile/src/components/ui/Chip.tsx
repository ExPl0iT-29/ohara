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

/** Material 3 filter chip: outlined at rest, tonal with a check when selected. */
export function Chip({ label, selected = false, onPress, tone = "brand", size = "sm" }: ChipProps) {
  const box = selected
    ? "border-transparent bg-brand-light dark:bg-brand-deep"
    : "border-ink-faint bg-transparent dark:border-line-dark";
  const text = selected ? "text-brand-dark dark:text-brand-onDeep" : "text-ink-soft dark:text-ink-faint";
  const name = tone === "tag" ? `#${label}` : label;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`flex-row items-center justify-center border ${size === "md" ? "h-10 rounded-[12px] px-4" : "h-8 rounded-[8px] px-3"} ${box}`}
    >
      <Text className={`font-ui text-caption ${text}`}>{selected ? `✓  ${name}` : name}</Text>
    </Pressable>
  );
}
