import type { ReactNode } from "react";
import { View } from "react-native";

interface CardProps {
  children: ReactNode;
  /** Kept for API compatibility with collection cards; not drawn in this direction. */
  tabColor?: string;
  className?: string;
}

/** A filled container (M3 surface container) with large rounded corners. */
export function Card({ children, className = "" }: CardProps) {
  return <View className={`rounded-card bg-raised dark:bg-raised-dark ${className}`}>{children}</View>;
}
