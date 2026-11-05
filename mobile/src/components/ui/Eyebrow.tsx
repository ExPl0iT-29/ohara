import { Text } from "react-native";

interface EyebrowProps {
  label: string;
  tone?: "soft" | "accent";
}

/** Material 3 label: a small section or source label above content. */
export function Eyebrow({ label, tone = "soft" }: EyebrowProps) {
  const color = tone === "accent" ? "text-brand dark:text-brand-bright" : "text-ink-soft dark:text-ink-faint";
  return <Text className={`font-ui text-eyebrow ${color}`}>{label}</Text>;
}
