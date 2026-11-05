import { Pressable, Text } from "react-native";

type ChipTone = "brand" | "tag";

const SELECTED_BG: Record<ChipTone, string> = {
  brand: "bg-brand",
  tag: "bg-accent-violet",
};

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Which accent marks the selected state: content filters use brand, user tags use tag. */
  tone?: ChipTone;
  size?: "sm" | "md";
}

/** A selectable pill used for filters, tabs and content-type pickers. */
export function Chip({ label, selected = false, onPress, tone = "brand", size = "sm" }: ChipProps) {
  const shape = size === "md" ? "border-3 px-4 py-1.5" : "border-2 px-3 py-1";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-pill border-ink ${shape} ${selected ? SELECTED_BG[tone] : "bg-paper dark:bg-surface-dark"}`}
    >
      <Text className="font-ui text-caption font-bold text-ink">{label}</Text>
    </Pressable>
  );
}
