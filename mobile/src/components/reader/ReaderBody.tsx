import { Text } from "react-native";

interface ReaderBodyProps {
  extractedText: string | null;
}

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  if (!extractedText) return null;

  return (
    <Text className="text-body leading-loose text-ink" style={{ maxWidth: 680 }}>
      {extractedText}
    </Text>
  );
}
