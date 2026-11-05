import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../src/components/ui/Button";
import { Card } from "../src/components/ui/Card";
import { setSetting } from "../src/db/settings";
import { Screen } from "../src/components/ui/Screen";

export default function OnboardingScreen() {
  const router = useRouter();

  const getStarted = () => {
    setSetting("onboarding_complete", "1");
    router.replace("/");
  };

  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 p-6">
        <View className="gap-2">
          <Text className="font-heading text-display text-ink dark:text-paper">Welcome to Ohara</Text>
          <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
            Save links from anywhere. Ohara pulls out the article on your device, so you get a clean,
            distraction-free reading list. No account, no ads, nothing leaves your phone.
          </Text>
        </View>

        <Card className="gap-3 p-4">
          <Text className="font-heading text-title text-ink dark:text-paper">Add your first link</Text>
          <View className="gap-2">
            <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
              1. Tap "Save a link" and paste a URL.
            </Text>
            <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
              2. Or share a link into Ohara from your browser or any app's share sheet.
            </Text>
          </View>
        </Card>

        <Button pill variant="primary" onPress={getStarted}>
          <Text className="font-ui text-body font-extrabold text-ink">Get started</Text>
        </Button>
      </View>
    </Screen>
  );
}
