import type { ReactNode } from "react";
import { View } from "react-native";

export type NoticeTone = "neutral" | "success" | "danger" | "highlight";

const TONE_BG: Record<NoticeTone, string> = {
  neutral: "bg-raised dark:bg-raised-dark",
  success: "bg-brand-light dark:bg-brand-deep",
  danger: "bg-danger-light dark:bg-danger-deep",
  highlight: "bg-accent-yellowLight dark:bg-accent-yellowDeep",
};

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
  compact?: boolean;
}

/** A tonal message container: status notes, "already saved", saved highlights. */
export function Notice({ children, tone = "neutral", compact = false }: NoticeProps) {
  return <View className={`rounded-[20px] ${compact ? "gap-1.5 px-4 py-3.5" : "gap-3 p-5"} ${TONE_BG[tone]}`}>{children}</View>;
}

/** Text colour that reads on a given notice tone in both themes. */
export function noticeText(_tone: NoticeTone): string {
  return "text-ink dark:text-paper";
}

/** Secondary text colour on a given notice tone. */
export function noticeSoftText(_tone: NoticeTone): string {
  return "text-ink-soft dark:text-ink-faint";
}
