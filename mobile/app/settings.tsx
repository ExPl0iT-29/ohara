import { useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { exportBackup, importBackup } from "../src/backup/backup";
import { setSetting } from "../src/db/settings";
import { Button } from "../src/components/ui/Button";
import { Card } from "../src/components/ui/Card";
import { Chip } from "../src/components/ui/Chip";
import { PRIVACY_POLICY_URL, SUPPORT_URL, TERMS_URL } from "../src/constants/links";
import { Screen } from "../src/components/ui/Screen";

const THEME_OPTIONS = ["light", "dark", "system"] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

  const handleExport = async () => {
    setBusy(true);
    try {
      await exportBackup();
    } catch (error) {
      Alert.alert("Export failed", error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    setBusy(true);
    try {
      const { imported } = await importBackup();
      queryClient.invalidateQueries({ queryKey: ["content"] });
      if (imported > 0) Alert.alert("Import complete", `Imported ${imported} item(s).`);
    } catch (error) {
      Alert.alert("Import failed", error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  };

  const openPage = async (url: string, name: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(`Couldn't open the ${name}`, `You can read it at ${url}`);
    }
  };


  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <Text className="font-heading text-title text-ink dark:text-paper">Appearance</Text>
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map((option) => (
            <Chip
              key={option}
              size="md"
              label={option}
              selected={colorScheme === option || (option === "system" && colorScheme === undefined)}
              onPress={() => {
                setColorScheme(option);
                setSetting("theme", option);
              }}
            />
          ))}
        </View>

        <Text className="font-heading mt-4 text-title text-ink dark:text-paper">Backup</Text>
        <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
          Export your whole library as JSON, or import a backup (or a plain list of URLs saved from your PC).
        </Text>

        <Button variant="primary" label="Export library" disabled={busy} onPress={handleExport} />

        <Card>
          <Pressable
            className="p-4 active:opacity-80 disabled:opacity-40"
            disabled={busy}
            onPress={handleImport}
          >
            <Text className="font-ui text-center text-body font-bold text-ink dark:text-paper">Import from file</Text>
          </Pressable>
        </Card>

        <Card>
          <Pressable className="p-4 active:opacity-80" onPress={() => router.push("/stats")}>
            <Text className="font-ui text-center text-body font-bold text-ink dark:text-paper">Library stats</Text>
          </Pressable>
        </Card>

        <Text className="font-heading mt-4 text-title text-ink dark:text-paper">About</Text>
        <Text className="font-ui text-body text-ink-soft dark:text-ink-faint">
          Ohara keeps everything on your phone. No account, no ads, no tracking.
        </Text>

        {[
          { label: "Privacy policy", url: PRIVACY_POLICY_URL, name: "privacy policy" },
          { label: "Terms of use", url: TERMS_URL, name: "terms of use" },
          { label: "Help and support", url: SUPPORT_URL, name: "support page" },
        ].map((page) => (
          <Card key={page.label}>
            <Pressable className="p-4 active:opacity-80" accessibilityRole="link" onPress={() => void openPage(page.url, page.name)}>
              <Text className="font-ui text-center text-body font-bold text-ink dark:text-paper">{page.label}</Text>
            </Pressable>
          </Card>
        ))}

        <Text className="font-ui text-center text-caption text-ink-soft dark:text-ink-faint">
          Version {Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
      </ScrollView>
    </Screen>
  );
}
