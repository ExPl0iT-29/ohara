import { Text } from "react-native";

interface EyebrowProps {
  label: string;
  tone?: "soft" | "accent";
}

/** Small uppercase label above a title or list section. */
export function Eyebrow({ label, tone = "soft" }: EyebrowProps) {
  const color = tone === "accent" ? "text-brand dark:text-brand-bright" : "text-ink-soft dark:text-ink-faint";
  return <Text className={`font-ui text-eyebrow uppercase ${color}`}>{label}</Text>;
}
