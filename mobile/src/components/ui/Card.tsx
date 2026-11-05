import type { ReactNode } from "react";
import { View } from "react-native";

interface CardProps {
  children: ReactNode;
  /** Kept for API compatibility with collection cards; Quiet Shelf does not draw folder tabs. */
  tabColor?: string;
  className?: string;
}

/** A raised surface for grouped content: white on paper, outlined by a hairline. */
export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`rounded-card border border-line bg-raised dark:border-line-dark dark:bg-raised-dark ${className}`}>
      {children}
    </View>
  );
}
