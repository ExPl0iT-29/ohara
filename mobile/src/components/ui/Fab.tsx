import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FabProps {
  onPress: () => void;
  accessibilityLabel: string;
}

/** Floating "save a link" button: an ink disc with a soft native shadow that springs when pressed. */
export function Fab({ onPress, accessibilityLabel }: FabProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View pointerEvents="box-none" className="absolute bottom-8 right-6">
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 18 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14 });
        }}
        className="h-14 w-14 items-center justify-center rounded-full bg-ink dark:bg-paper"
        style={[{ elevation: 4 }, style]}
      >
        <Text className="font-ui text-3xl leading-none text-paper dark:text-surface-dark">+</Text>
      </AnimatedPressable>
    </View>
  );
}
