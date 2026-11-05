import { TextInput, type TextInputProps } from "react-native";

import { useTheme } from "../../theme/useTheme";

const SHAPES = {
  /** Single-line rounded field: search. */
  pill: "rounded-pill border-3 border-ink px-4 py-2 text-body",
  /** Compact single-line field: inline tag entry. */
  pillSmall: "rounded-pill border-2 border-ink px-3 py-1.5 text-caption",
  /** Box for multi-line entry: links, quotes, notes. */
  box: "rounded-card border-3 border-ink bg-paper p-3 text-body dark:bg-surface-dark",
} as const;

interface TextFieldProps extends TextInputProps {
  shape?: keyof typeof SHAPES;
  className?: string;
}

/** The app's text input, with theme-aware placeholder colour. */
export function TextField({ shape = "pill", className = "", ...props }: TextFieldProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      className={`font-ui text-ink dark:text-paper ${SHAPES[shape]} ${className}`}
      {...props}
    />
  );
}
