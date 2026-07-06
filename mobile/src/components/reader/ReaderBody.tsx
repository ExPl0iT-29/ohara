import { Text } from "react-native";

interface ReaderBodyProps {
  extractedText: string | null;
}

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  if (!extractedText) return null;

  return (
    <Text className="text-lg leading-loose text-gray-900" style={{ maxWidth: 680 }}>
      {extractedText}
    </Text>
  );
}
