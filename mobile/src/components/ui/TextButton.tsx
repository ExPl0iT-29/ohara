import { Pressable, Text } from "react-native";

interface TextButtonProps {
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  size?: "sm" | "md";
}

/** Material 3 text button: accent label with a tonal press state. */
export function TextButton({ label, onPress, tone = "default", size = "sm" }: TextButtonProps) {
  const color = tone === "danger" ? "text-danger dark:text-danger-bright" : "text-brand dark:text-brand-bright";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="-ml-3 self-start rounded-pill px-3 py-2 active:bg-brand-light dark:active:bg-brand-deep"
    >
      <Text className={`font-ui font-semibold ${size === "md" ? "text-body" : "text-caption"} ${color}`}>{label}</Text>
    </Pressable>
  );
}
