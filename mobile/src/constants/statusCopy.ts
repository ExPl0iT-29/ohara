import type { ContentStatus } from "../api/content";

export const STATUS_LABELS: Partial<Record<ContentStatus, string>> = {
  pending: "Still preparing",
  processing: "Still preparing",
  failed: "Couldn't process",
};
