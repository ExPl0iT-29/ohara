import { Text, useWindowDimensions } from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import { useTheme, type Theme } from "../../theme/useTheme";

interface ReaderBodyProps {
  extractedText: string | null;
}

function buildTagsStyles({ colors, fonts }: Theme) {
  return {
    body: { color: colors.text, fontSize: 16, lineHeight: 26, fontFamily: fonts.reading },
    p: { marginBottom: 16 },
    img: { borderRadius: 16, marginVertical: 16 },
    h1: { fontSize: 24, fontWeight: "700", marginBottom: 12, marginTop: 20, fontFamily: fonts.heading },
    h2: { fontSize: 20, fontWeight: "700", marginBottom: 12, marginTop: 20, fontFamily: fonts.heading },
    h3: { fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 16, fontFamily: fonts.heading },
    a: { color: colors.link },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: colors.link,
      paddingLeft: 16,
      marginLeft: 0,
      color: colors.textSoft,
    },
    li: { marginBottom: 6 },
  } as const;
}

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  if (!extractedText) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(extractedText);
  if (!isHtml) {
    return (
      <Text className="font-reading text-body leading-loose text-ink dark:text-paper" style={{ maxWidth: 680 }}>
        {extractedText}
      </Text>
    );
  }

  return (
    <RenderHtml
      contentWidth={Math.min(width - 40, 680)}
      source={{ html: extractedText }}
      tagsStyles={buildTagsStyles(theme)}
      // The renderer drops font families it does not know about, so register the theme's.
      systemFonts={[...defaultSystemFonts, theme.fonts.reading, theme.fonts.heading]}
    />
  );
}
