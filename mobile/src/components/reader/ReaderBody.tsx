import { useColorScheme } from "nativewind";
import { Text, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

interface ReaderBodyProps {
  extractedText: string | null;
}

const PALETTE = {
  light: { text: "#1C1917", soft: "#57534E", link: "#0F766E" },
  dark: { text: "#FAF9F6", soft: "#A8A29E", link: "#5EEAD4" },
};

function buildTagsStyles(theme: "light" | "dark") {
  const { text, soft, link } = PALETTE[theme];
  return {
    body: { color: text, fontSize: 16, lineHeight: 26 },
    p: { marginBottom: 16 },
    img: { borderRadius: 16, marginVertical: 16 },
    h1: { fontSize: 24, fontWeight: "700", marginBottom: 12, marginTop: 20 },
    h2: { fontSize: 20, fontWeight: "700", marginBottom: 12, marginTop: 20 },
    h3: { fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 16 },
    a: { color: link },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: link,
      paddingLeft: 16,
      marginLeft: 0,
      color: soft,
    },
    li: { marginBottom: 6 },
  } as const;
}

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  if (!extractedText) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(extractedText);
  if (!isHtml) {
    return (
      <Text className="text-body leading-loose text-ink dark:text-paper" style={{ maxWidth: 680 }}>
        {extractedText}
      </Text>
    );
  }

  return (
    <RenderHtml
      contentWidth={Math.min(width - 40, 680)}
      source={{ html: extractedText }}
      tagsStyles={buildTagsStyles(theme)}
    />
  );
}
