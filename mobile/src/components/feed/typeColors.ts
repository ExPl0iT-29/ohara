import type { ContentType } from "../../api/content";

/** Colour marks content type, so a glance at the list says what each item is. */
type TypeFamily = "yellow" | "pink" | "violet" | "mint" | "blue";

const FAMILY: Record<ContentType, TypeFamily> = {
  blog: "yellow",
  website: "yellow",
  youtube: "pink",
  pdf: "violet",
  paper: "violet",
  book: "violet",
  documentation: "mint",
  github: "mint",
  tweet: "blue",
  reddit: "blue",
  other: "yellow",
};

const SOLID: Record<TypeFamily, string> = {
  yellow: "bg-accent-yellow",
  pink: "bg-accent-pink",
  violet: "bg-accent-violet",
  mint: "bg-accent-mint",
  blue: "bg-accent-blue",
};

const TINT: Record<TypeFamily, string> = {
  yellow: "bg-accent-yellowLight dark:bg-accent-yellowDeep",
  pink: "bg-accent-pinkLight dark:bg-accent-pinkDeep",
  violet: "bg-accent-violetLight dark:bg-accent-violetDeep",
  mint: "bg-accent-mintLight dark:bg-accent-mintDeep",
  blue: "bg-accent-blueLight dark:bg-accent-blueDeep",
};

/** Solid accent fill for a content type (tiles, bands). */
export function typeSolid(type: ContentType): string {
  return SOLID[FAMILY[type]];
}

/** Pale tint for a content type (type pills), with a dark-mode variant. */
export function typeTint(type: ContentType): string {
  return TINT[FAMILY[type]];
}
