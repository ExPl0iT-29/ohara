import { Pressable, Text } from "react-native";

interface TextButtonProps {
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  size?: "sm" | "md";
}

/** A low-emphasis text action (open original, retry, remove). */
export function TextButton({ label, onPress, tone = "default", size = "sm" }: TextButtonProps) {
  const color = tone === "danger" ? "text-danger" : "text-ink dark:text-paper";
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="self-start">
      <Text className={`font-ui font-bold underline ${size === "md" ? "text-body" : "text-caption"} ${color}`}>{label}</Text>
    </Pressable>
  );
}
