import type { ReactNode } from "react";
import { View } from "react-native";

import { useTheme } from "../../theme/useTheme";

const SHADOW_OFFSET = 4;

interface CardProps {
  children: ReactNode;
  /** Folder-tab accent colour shown peeking above the card (collection cards). */
  tabColor?: string;
  className?: string;
}

/** A raised surface for grouped content. */
export function Card({ children, tabColor, className = "" }: CardProps) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingTop: tabColor ? 10 : 0 }}>
      {tabColor && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 12,
            right: 40,
            height: 18,
            backgroundColor: tabColor,
            borderWidth: 3,
            borderColor: colors.line,
            borderBottomWidth: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}
      <View style={{ position: "relative" }}>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: SHADOW_OFFSET,
            left: SHADOW_OFFSET,
            right: -SHADOW_OFFSET,
            bottom: -SHADOW_OFFSET,
            backgroundColor: colors.shadow,
            borderRadius: 16,
          }}
        />
        <View className={`rounded-card border-3 border-ink bg-paper dark:bg-surface-dark ${className}`}>
          {children}
        </View>
      </View>
    </View>
  );
}
