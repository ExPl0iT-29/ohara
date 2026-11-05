import type { ReactNode } from "react";
import { View } from "react-native";

export type NoticeTone = "neutral" | "success" | "danger" | "highlight";

const TONE_BOX: Record<NoticeTone, string> = {
  neutral: "rounded-card border border-line bg-raised dark:border-line-dark dark:bg-raised-dark",
  success: "rounded-card bg-brand-light dark:bg-brand-deep",
  danger: "rounded-card bg-danger-light dark:bg-danger-deep",
  // A saved quote reads like a pull-quote: a teal rule, no box.
  highlight: "border-l-2 border-brand dark:border-brand-bright",
};

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
  compact?: boolean;
}

/** A message block: status notes, "already saved", saved highlights. */
export function Notice({ children, tone = "neutral", compact = false }: NoticeProps) {
  const pad = tone === "highlight" ? "gap-1 py-1 pl-4" : compact ? "gap-1 p-3" : "gap-3 p-4";
  return <View className={`${TONE_BOX[tone]} ${pad}`}>{children}</View>;
}

/** Text colour that reads on a given notice tone in both themes. */
export function noticeText(_tone: NoticeTone): string {
  return "text-ink dark:text-paper";
}

/** Secondary text colour on a given notice tone. */
export function noticeSoftText(_tone: NoticeTone): string {
  return "text-ink-soft dark:text-ink-faint";
}
