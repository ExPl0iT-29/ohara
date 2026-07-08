import { Text, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

interface ReaderBodyProps {
  extractedText: string | null;
}

const TAGS_STYLES = {
  body: { color: "#1C1917", fontSize: 16, lineHeight: 26 },
  p: { marginBottom: 16 },
  img: { borderRadius: 16, marginVertical: 16 },
  h1: { fontSize: 24, fontWeight: "700", marginBottom: 12, marginTop: 20 },
  h2: { fontSize: 20, fontWeight: "700", marginBottom: 12, marginTop: 20 },
  h3: { fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 16 },
  a: { color: "#0F766E" },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "#0F766E",
    paddingLeft: 16,
    marginLeft: 0,
    color: "#57534E",
  },
  li: { marginBottom: 6 },
} as const;

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  const { width } = useWindowDimensions();
  if (!extractedText) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(extractedText);
  if (!isHtml) {
    return (
      <Text className="text-body leading-loose text-ink" style={{ maxWidth: 680 }}>
        {extractedText}
      </Text>
    );
  }

  return (
    <RenderHtml
      contentWidth={Math.min(width - 40, 680)}
      source={{ html: extractedText }}
      tagsStyles={TAGS_STYLES}
    />
  );
}
