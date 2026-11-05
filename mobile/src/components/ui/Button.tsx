import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "../../theme/useTheme";

const SHADOW_OFFSET = 3;

type ButtonVariant = "primary" | "destructive" | "neutral";

const VARIANT_BG: Record<ButtonVariant, string> = {
  primary: "bg-brand",
  destructive: "bg-danger",
  neutral: "bg-raised dark:bg-raised-dark",
};

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
  const radius = pill ? 999 : 12;

  const shadowStyle = useAnimatedStyle(() => ({ opacity: 1 - pressed.value }));
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pressed.value * SHADOW_OFFSET }, { translateY: pressed.value * SHADOW_OFFSET }],
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPressIn={() => {
        if (!disabled) pressed.value = withTiming(1, { duration: 70 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 110 });
      }}
      style={{ position: "relative", opacity: disabled ? 0.4 : 1 }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          shadowStyle,
          { position: "absolute", top: SHADOW_OFFSET, left: SHADOW_OFFSET, right: -SHADOW_OFFSET, bottom: -SHADOW_OFFSET, backgroundColor: colors.shadow, borderRadius: radius },
        ]}
      />
      <Animated.View
        className={`items-center justify-center border-2.5 border-line dark:border-line-dark ${size === "sm" ? "px-3.5 py-1.5" : "px-5 py-3"} ${
          pill ? "rounded-pill" : "rounded-xl"
        } ${VARIANT_BG[variant]} ${className}`}
        style={faceStyle}
      >
        <Text className={`text-center font-ui font-extrabold ${size === "sm" ? "text-caption" : "text-body"} ${VARIANT_TEXT[variant]}`}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
