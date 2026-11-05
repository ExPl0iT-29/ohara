import type { ReactNode } from "react";
import { View } from "react-native";

import { useTheme } from "../../theme/useTheme";
import { HardShadow } from "./HardShadow";

interface CardProps {
  children: ReactNode;
  /** Folder-tab accent colour shown peeking above the card (collection cards). */
  tabColor?: string;
  className?: string;
}

/** A raised surface: 2.5dp line, 4dp hard shadow. */
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
            borderWidth: 2.5,
            borderColor: colors.line,
            borderBottomWidth: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}
      <HardShadow radius={14}>
        <View className={`rounded-card border-2.5 border-line bg-raised dark:border-line-dark dark:bg-raised-dark ${className}`}>{children}</View>
      </HardShadow>
    </View>
  );
}
