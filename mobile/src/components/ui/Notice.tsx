import type { ReactNode } from "react";
import { View } from "react-native";

export type NoticeTone = "neutral" | "success" | "danger" | "highlight";

const TONE_BG: Record<NoticeTone, string> = {
  neutral: "bg-raised dark:bg-raised-dark",
  success: "bg-accent-mintLight dark:bg-accent-mintDeep",
  danger: "bg-danger-light dark:bg-danger-deep",
  highlight: "bg-accent-yellowLight dark:bg-accent-yellowDeep",
};

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
  compact?: boolean;
}

/** A boxed message: status notes, "already saved", saved highlights. Flat: no shadow. */
export function Notice({ children, tone = "neutral", compact = false }: NoticeProps) {
  return (
    <View className={`rounded-card border-2.5 border-line dark:border-line-dark ${compact ? "gap-1 p-3" : "gap-3 p-4"} ${TONE_BG[tone]}`}>
      {children}
    </View>
  );
}

/** Text colour that reads on a given notice tone in both themes. */
export function noticeText(_tone: NoticeTone): string {
  return "text-ink dark:text-paper";
}

/** Secondary text colour on a given notice tone. */
export function noticeSoftText(_tone: NoticeTone): string {
  return "text-ink-soft dark:text-ink-faint";
}
