import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

/** Full-screen background for every route. */
export function Screen({ children, className = "" }: ScreenProps) {
  return <SafeAreaView className={`flex-1 bg-paper dark:bg-surface-dark ${className}`}>{children}</SafeAreaView>;
}
