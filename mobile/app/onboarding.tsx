import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrutalButton } from "../src/components/ui/BrutalButton";
import { BrutalCard } from "../src/components/ui/BrutalCard";
import { setSetting } from "../src/db/settings";

export default function OnboardingScreen() {
  const router = useRouter();

  const getStarted = () => {
    setSetting("onboarding_complete", "1");
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <View className="flex-1 justify-center gap-6 p-6">
        <View className="gap-2">
          <Text className="text-display text-ink dark:text-paper">Welcome to Ohara</Text>
          <Text className="text-body text-ink-soft dark:text-ink-faint">
            Save links from anywhere. Ohara extracts and summarizes them on your device, so you get
            a clean, distraction-free reading list.
          </Text>
        </View>

        <BrutalCard className="gap-3 p-4">
          <Text className="text-title text-ink dark:text-paper">Add your first link</Text>
          <View className="gap-2">
            <Text className="text-body text-ink-soft dark:text-ink-faint">
              1. Tap "Save a link" and paste a URL.
            </Text>
            <Text className="text-body text-ink-soft dark:text-ink-faint">
              2. Or share a link into Ohara from your browser or any app's share sheet.
            </Text>
          </View>
        </BrutalCard>

        <BrutalButton pill variant="primary" onPress={getStarted}>
          <Text className="text-body font-extrabold text-ink">Get started</Text>
        </BrutalButton>
      </View>
    </SafeAreaView>
  );
}
