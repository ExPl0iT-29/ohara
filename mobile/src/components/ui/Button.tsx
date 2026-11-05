import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = "primary" | "destructive" | "neutral";

// primary = M3 filled, neutral = filled tonal, destructive = error filled.
const VARIANT_BOX: Record<ButtonVariant, string> = {
  primary: "bg-brand dark:bg-brand-bright",
  destructive: "bg-danger dark:bg-danger-bright",
  neutral: "bg-brand-light dark:bg-brand-deep",
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: "text-white dark:text-brand-onBright",
  destructive: "text-white dark:text-surface-dark",
  neutral: "text-brand-dark dark:text-brand-onDeep",
};

const HEIGHT = { sm: 40, md: 52 } as const;

interface ButtonProps {
  label: string;
  /** "sm" for inline actions, "md" for a screen's main action. */
  size?: "sm" | "md";
  onPress?: () => void;
  variant?: ButtonVariant;
  /** Fully round ends at rest. Otherwise a large rounded rectangle. */
  pill?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Material 3 Expressive button: the shape squares off and springs back when pressed. */
export function Button({
  label,
  size = "md",
  onPress,
  variant = "neutral",
  pill = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const height = HEIGHT[size];
  const restRadius = pill ? height / 2 : 16;
  const pressedRadius = size === "sm" ? 10 : 12;
  const pressed = useSharedValue(0);

  const shapeStyle = useAnimatedStyle(() => ({
    borderRadius: restRadius + (pressedRadius - restRadius) * pressed.value,
    transform: [{ scale: 1 - 0.03 * pressed.value }],
  }));

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPressIn={() => {
        if (!disabled) pressed.value = withSpring(1, { damping: 16, stiffness: 400 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 12, stiffness: 300 });
      }}
      className={`items-center justify-center ${size === "sm" ? "px-5" : "px-7"} ${VARIANT_BOX[variant]} ${className}`}
      style={[{ height, opacity: disabled ? 0.38 : 1 }, shapeStyle]}
    >
      <Text className={`text-center font-ui font-semibold ${size === "sm" ? "text-caption" : "text-body"} ${VARIANT_TEXT[variant]}`}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
