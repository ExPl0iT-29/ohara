import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "../../theme/useTheme";

const SHADOW_OFFSET = 4;

const VARIANT_BG: Record<ButtonVariant, string> = {
  primary: "bg-brand",
  destructive: "bg-danger",
  neutral: "bg-paper dark:bg-surface-dark",
};

type ButtonVariant = "primary" | "destructive" | "neutral";

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: "text-ink",
  destructive: "text-ink",
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

/** The app's button. Pressing slides the face onto its hard-offset shadow. */
export function Button({
  label,
  size = "md",
  onPress,
  variant = "neutral",
  pill = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pressed.value * SHADOW_OFFSET },
      { translateY: pressed.value * SHADOW_OFFSET },
    ],
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) pressed.value = withTiming(1, { duration: 80 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 120 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{ position: "relative", opacity: disabled ? 0.4 : 1 }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          shadowStyle,
          {
            position: "absolute",
            top: SHADOW_OFFSET,
            left: SHADOW_OFFSET,
            right: -SHADOW_OFFSET,
            bottom: -SHADOW_OFFSET,
            backgroundColor: colors.shadow,
            borderRadius: pill ? 999 : 12,
          },
        ]}
      />
      <Animated.View
        className={`items-center justify-center border-3 border-ink ${size === "sm" ? "px-3 py-1.5" : "px-4 py-2.5"} ${
          pill ? "rounded-pill" : "rounded-card"
        } ${VARIANT_BG[variant]} ${className}`}
        style={contentStyle}
      >
        <Text
          className={`text-center font-ui font-extrabold ${size === "sm" ? "text-caption" : "text-body"} ${VARIANT_TEXT[variant]}`}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
