import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FabProps {
  onPress: () => void;
  accessibilityLabel: string;
  /** Distance from the bottom edge, e.g. to clear a navigation bar. */
  bottomOffset?: number;
}

/** Material 3 extended FAB in the tertiary container colour; scales and springs when pressed. */
export function Fab({ onPress, accessibilityLabel, bottomOffset = 32 }: FabProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View pointerEvents="box-none" className="absolute right-4" style={{ bottom: bottomOffset }}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 250 });
        }}
        className="h-14 flex-row items-center gap-2 rounded-[16px] bg-accent-yellow px-5 dark:bg-accent-yellowDeep"
        style={[{ elevation: 3 }, style]}
      >
        <Text className="font-ui text-[22px] leading-[24px] text-ink dark:text-accent-yellowOnDeep">+</Text>
        <Text className="font-ui text-body font-semibold text-ink dark:text-accent-yellowOnDeep">Save link</Text>
      </AnimatedPressable>
    </View>
  );
}
