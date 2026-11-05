import type { ReactNode } from "react";
import { View } from "react-native";

export type NoticeTone = "neutral" | "success" | "danger" | "highlight";

const TONE_BG: Record<NoticeTone, string> = {
  neutral: "bg-paper dark:bg-surface-dark",
  success: "bg-accent-mintLight",
  danger: "bg-danger-light",
  highlight: "bg-accent-yellowLight",
};

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
  compact?: boolean;
}

/** A boxed message: status notes, "already saved", saved highlights. */
export function Notice({ children, tone = "neutral", compact = false }: NoticeProps) {
  return (
    <View className={`rounded-card border-3 border-ink ${compact ? "gap-1 p-3" : "gap-3 p-4"} ${TONE_BG[tone]}`}>
      {children}
    </View>
  );
}

/** Text colour that reads on a given notice tone in both themes. */
export function noticeText(tone: NoticeTone): string {
  return tone === "neutral" ? "text-ink dark:text-paper" : "text-ink";
}

/** Secondary text colour on a given notice tone. */
export function noticeSoftText(tone: NoticeTone): string {
  return tone === "neutral" ? "text-ink-soft dark:text-ink-faint" : "text-ink-soft";
}
