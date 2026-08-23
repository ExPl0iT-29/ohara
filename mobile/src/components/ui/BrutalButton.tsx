import type { ReactNode } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const SHADOW_OFFSET = 4;

const VARIANT_BG: Record<string, string> = {
  primary: "bg-brand",
  destructive: "bg-danger",
  neutral: "bg-paper dark:bg-surface-dark",
};

interface BrutalButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "destructive" | "neutral";
  pill?: boolean;
  disabled?: boolean;
  className?: string;
}

export function BrutalButton({
  children,
  onPress,
  variant = "neutral",
  pill = false,
  disabled = false,
  className = "",
}: BrutalButtonProps) {
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
            backgroundColor: "#1C1917",
            borderRadius: pill ? 999 : 12,
          },
        ]}
      />
      <Animated.View
        className={`items-center justify-center border-3 border-ink px-4 py-2.5 ${
          pill ? "rounded-pill" : "rounded-card"
        } ${VARIANT_BG[variant]} ${className}`}
        style={contentStyle}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
