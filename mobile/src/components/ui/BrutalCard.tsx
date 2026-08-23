import type { ReactNode } from "react";
import { View } from "react-native";

const SHADOW_OFFSET = 4;

interface BrutalCardProps {
  children: ReactNode;
  /** Folder-tab accent color shown peeking above the card (collection cards). */
  tabColor?: string;
  className?: string;
}

export function BrutalCard({ children, tabColor, className = "" }: BrutalCardProps) {
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
            borderColor: "#1C1917",
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
            backgroundColor: "#1C1917",
            borderRadius: 16,
          }}
        />
        <View
          className={`rounded-card border-3 border-ink bg-paper dark:bg-surface-dark ${className}`}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
