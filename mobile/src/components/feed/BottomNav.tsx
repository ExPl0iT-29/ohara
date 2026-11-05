import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface NavDestination {
  key: string;
  label: string;
  glyph: string;
  selected: boolean;
  onPress: () => void;
}

export const BOTTOM_NAV_HEIGHT = 80;

/** Material 3 navigation bar: icon in a pill indicator above a label. */
export function BottomNav({ destinations }: { destinations: NavDestination[] }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row bg-raised dark:bg-raised-dark"
      style={{ height: BOTTOM_NAV_HEIGHT + insets.bottom, paddingBottom: insets.bottom }}
      accessibilityRole="tablist"
    >
      {destinations.map((destination) => (
        <Pressable
          key={destination.key}
          onPress={destination.onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: destination.selected }}
          accessibilityLabel={destination.label}
          className="flex-1 items-center justify-center gap-1"
        >
          <View
            className={`h-8 w-16 items-center justify-center rounded-pill ${destination.selected ? "bg-brand-light dark:bg-brand-deep" : ""}`}
          >
            <Text className="font-ui text-[18px] leading-[22px] text-ink dark:text-paper">{destination.glyph}</Text>
          </View>
          <Text
            className={`font-ui text-[12px] leading-[16px] ${destination.selected ? "font-bold text-ink dark:text-paper" : "font-medium text-ink-soft dark:text-ink-faint"}`}
          >
            {destination.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
