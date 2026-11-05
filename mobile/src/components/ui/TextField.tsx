import { TextInput, type TextInputProps } from "react-native";

import { useTheme } from "../../theme/useTheme";

const FILLED = "bg-raised dark:bg-raised-dark";

const SHAPES = {
  /** M3 search bar: a full-round filled field. */
  pill: `h-14 rounded-pill px-6 text-body ${FILLED}`,
  /** Compact single-line field: inline tag entry. */
  pillSmall: `h-10 rounded-pill px-4 text-caption ${FILLED}`,
  /** Filled multi-line field with large corners. */
  box: `min-h-[56px] rounded-[16px] px-4 py-3.5 text-body ${FILLED}`,
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
      placeholderTextColor={colors.textSoft}
      cursorColor={colors.accent}
      selectionColor={colors.highlight}
      className={`font-ui text-ink dark:text-paper ${SHAPES[shape]} ${className}`}
      {...props}
    />
  );
}
