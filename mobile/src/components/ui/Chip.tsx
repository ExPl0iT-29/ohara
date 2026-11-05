import { Pressable, Text } from "react-native";

type ChipTone = "brand" | "tag";

const SELECTED: Record<ChipTone, { box: string; text: string }> = {
  brand: { box: "bg-ink dark:bg-brand", text: "text-paper dark:text-ink" },
  tag: { box: "bg-accent-violet", text: "text-white" },
};

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Content filters use brand; user tags use tag, shown with a leading #. */
  tone?: ChipTone;
  size?: "sm" | "md";
}

/** A selectable pill. Flat (no shadow): chips sit one level below buttons. */
export function Chip({ label, selected = false, onPress, tone = "brand", size = "sm" }: ChipProps) {
  const box = selected ? SELECTED[tone].box : "bg-raised dark:bg-raised-dark";
  const text = selected ? SELECTED[tone].text : "text-ink dark:text-paper";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-pill border-2 border-line dark:border-line-dark ${size === "md" ? "px-4 py-1.5" : "px-3 py-1"} ${box}`}
    >
      <Text className={`font-ui text-caption font-bold ${text}`}>{tone === "tag" ? `#${label}` : label}</Text>
    </Pressable>
  );
}
