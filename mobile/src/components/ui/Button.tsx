import { Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "destructive" | "neutral";

const VARIANT_BOX: Record<ButtonVariant, string> = {
  primary: "bg-brand dark:bg-brand-bright",
  destructive: "bg-danger dark:bg-danger-bright",
  neutral: "border border-line bg-raised dark:border-line-dark dark:bg-raised-dark",
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: "text-white dark:text-surface-dark",
  destructive: "text-white dark:text-surface-dark",
  neutral: "text-ink dark:text-paper",
};

interface ButtonProps {
  label: string;
  /** "sm" for inline actions, "md" for a screen's main action. */
  size?: "sm" | "md";
  onPress?: () => void;
  variant?: ButtonVariant;
  pill?: boolean;
  disabled?: boolean;
  className?: string;
}

/** The app's button: a flat, filled shape that dims slightly while pressed. */
export function Button({
  label,
  size = "md",
  onPress,
  variant = "neutral",
  pill = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={`items-center justify-center ${size === "sm" ? "px-4 py-2" : "px-5 py-3"} ${
        pill ? "rounded-pill" : "rounded-card"
      } ${VARIANT_BOX[variant]} active:opacity-80 ${className}`}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Text className={`text-center font-ui font-semibold ${size === "sm" ? "text-caption" : "text-body"} ${VARIANT_TEXT[variant]}`}>
        {label}
      </Text>
    </Pressable>
  );
}
