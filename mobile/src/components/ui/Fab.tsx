import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useTheme } from "../../theme/useTheme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FabProps {
  onPress: () => void;
  accessibilityLabel: string;
}

/** Floating "save a link" button: a yellow tile on a hard shadow that springs when pressed. */
export function Fab({ onPress, accessibilityLabel }: FabProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View pointerEvents="box-none" className="absolute bottom-8 right-6">
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 4, left: 4, right: -4, bottom: -4, backgroundColor: colors.shadow, borderRadius: 18 }}
      />
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        className="h-14 w-14 items-center justify-center rounded-[18px] border-2.5 border-line bg-brand dark:border-line-dark"
        style={style}
      >
        <Text className="font-heading text-[30px] font-extrabold leading-[32px] text-ink">+</Text>
      </AnimatedPressable>
    </View>
  );
}
