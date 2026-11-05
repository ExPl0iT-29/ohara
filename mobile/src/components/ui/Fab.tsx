import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useTheme } from "../../theme/useTheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FabProps {
  onPress: () => void;
  accessibilityLabel: string;
}

/** Floating "save a link" button, pinned bottom-right. */
export function Fab({ onPress, accessibilityLabel }: FabProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View pointerEvents="box-none" className="absolute bottom-8 right-6">
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 5, left: 5, right: -5, bottom: -5, backgroundColor: colors.shadow, borderRadius: 999 }}
      />
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className="h-14 w-14 items-center justify-center rounded-full border-3 border-ink bg-brand"
        style={style}
        onPressIn={() => {
          scale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
      >
        <Text className="font-heading text-3xl font-extrabold leading-none text-ink">+</Text>
      </AnimatedPressable>
    </View>
  );
}
