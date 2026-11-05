import { TextInput, type TextInputProps } from "react-native";

import { useTheme } from "../../theme/useTheme";

const FIELD = "border-2.5 border-line bg-raised dark:border-line-dark dark:bg-raised-dark";

const SHAPES = {
  /** Single-line rounded field: search. */
  pill: `rounded-pill px-4 py-2.5 text-body ${FIELD}`,
  /** Compact single-line field: inline tag entry. */
  pillSmall: `rounded-pill px-3 py-1.5 text-caption ${FIELD}`,
  /** Box for multi-line entry: links, quotes, notes. */
  box: `rounded-card p-3 text-body ${FIELD}`,
} as const;

interface TextFieldProps extends TextInputProps {
  shape?: keyof typeof SHAPES;
  className?: string;
}

/** The app's text input, with theme-aware placeholder, cursor and selection colours. */
export function TextField({ shape = "pill", className = "", ...props }: TextFieldProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      cursorColor={colors.text}
      selectionColor={colors.accent}
      className={`font-ui text-ink dark:text-paper ${SHAPES[shape]} ${className}`}
      {...props}
    />
  );
}
