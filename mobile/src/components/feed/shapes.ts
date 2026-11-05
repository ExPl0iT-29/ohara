/** Corner radii only, so the same shape applies to a View or an Image. */
export interface CornerShape {
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
}

import type { ContentType } from "../../api/content";

/**
 * Material 3 Expressive shape variety for thumbnails: each content type gets
 * its own silhouette so the list reads at a glance. Pure corner radii, no masks.
 */
const SHAPES: Record<string, CornerShape> = {
  circle: { borderRadius: 999 },
  squircle: { borderRadius: 16 },
  leaf: { borderTopLeftRadius: 24, borderBottomRightRadius: 24, borderTopRightRadius: 6, borderBottomLeftRadius: 6 },
  arch: { borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  ticket: { borderRadius: 10 },
};

const BY_TYPE: Record<ContentType, keyof typeof SHAPES> = {
  youtube: "circle",
  pdf: "arch",
  paper: "arch",
  book: "arch",
  github: "squircle",
  documentation: "squircle",
  blog: "leaf",
  website: "leaf",
  tweet: "ticket",
  reddit: "ticket",
  other: "squircle",
};

export function thumbnailShape(type: ContentType): CornerShape {
  return SHAPES[BY_TYPE[type]];
}

/** Tonal fill per shape family, as NativeWind classes for light and dark. */
export function thumbnailTone(type: ContentType): string {
  switch (BY_TYPE[type]) {
    case "circle":
      return "bg-accent-pink dark:bg-[#5B3F47]";
    case "arch":
      return "bg-accent-yellow dark:bg-accent-yellowDeep";
    case "squircle":
      return "bg-accent-blue dark:bg-[#004A77]";
    case "ticket":
      return "bg-accent-violet dark:bg-[#3A4669]";
    default:
      return "bg-brand-light dark:bg-brand-deep";
  }
}
