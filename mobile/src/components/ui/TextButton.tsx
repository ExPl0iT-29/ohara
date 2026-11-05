import { Pressable, Text } from "react-native";

interface TextButtonProps {
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  size?: "sm" | "md";
}

/** A low-emphasis text action (open original, retry, remove). */
export function TextButton({ label, onPress, tone = "default", size = "sm" }: TextButtonProps) {
  const color = tone === "danger" ? "text-danger dark:text-danger-bright" : "text-ink dark:text-paper";
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="self-start py-0.5 active:opacity-60">
      <Text className={`font-ui font-extrabold underline ${size === "md" ? "text-body" : "text-caption"} ${color}`}>{label}</Text>
    </Pressable>
  );
}
