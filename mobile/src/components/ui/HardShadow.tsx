import type { ReactNode } from "react";
import { View } from "react-native";

import { useTheme } from "../../theme/useTheme";

interface HardShadowProps {
  children: ReactNode;
  /** Offset in dp: 4 for cards and the FAB, 3 for buttons. */
  offset?: number;
  radius: number;
}

/** A crisp, unblurred offset layer behind its child, identical on every platform. */
export function HardShadow({ children, offset = 4, radius }: HardShadowProps) {
  const { colors } = useTheme();
  return (
    <View style={{ position: "relative" }}>
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: offset, left: offset, right: -offset, bottom: -offset, backgroundColor: colors.shadow, borderRadius: radius }}
      />
      {children}
    </View>
  );
}
