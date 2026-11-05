import type { ReactNode } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

interface ScreenProps {
  children: ReactNode;
  className?: string;
  /** Safe-area edges to pad. Screens with their own bottom bar pass ["top", "left", "right"]. */
  edges?: Edge[];
}

/** Full-screen background for every route. */
export function Screen({ children, className = "", edges }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-paper dark:bg-surface-dark ${className}`}>
      {children}
    </SafeAreaView>
  );
}
