import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { exportBackup, importBackup } from "../src/backup/backup";
import { setSetting } from "../src/db/settings";

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

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <View className="gap-4 p-5">
        <Text className="text-title text-ink dark:text-paper">Appearance</Text>
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setColorScheme(option);
                setSetting("theme", option);
              }}
              className={`rounded-pill border px-3 py-1.5 ${
                colorScheme === option || (option === "system" && colorScheme === undefined)
                  ? "border-brand bg-brand"
                  : "border-line bg-white dark:border-ink-soft dark:bg-surface-dark"
              }`}
            >
              <Text
                className={
                  colorScheme === option
                    ? "text-caption text-white"
                    : "text-caption text-ink-soft dark:text-ink-faint"
                }
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-4 text-title text-ink dark:text-paper">Backup</Text>
        <Text className="text-body text-ink-soft dark:text-ink-faint">
          Export your whole library as JSON, or import a backup (or a plain list of URLs saved from your PC).
        </Text>

        <Pressable
          className="rounded-card bg-brand p-4 active:opacity-80 disabled:opacity-40"
          disabled={busy}
          onPress={handleExport}
        >
          <Text className="text-center text-body font-semibold text-white">Export library</Text>
        </Pressable>

        <Pressable
          className="rounded-card border border-line bg-white p-4 active:opacity-80 disabled:opacity-40 dark:border-ink-soft dark:bg-surface-dark"
          disabled={busy}
          onPress={handleImport}
        >
          <Text className="text-center text-body font-semibold text-ink dark:text-paper">Import from file</Text>
        </Pressable>

        <Pressable
          className="rounded-card border border-line bg-white p-4 active:opacity-80 dark:border-ink-soft dark:bg-surface-dark"
          onPress={() => router.push("/stats")}
        >
          <Text className="text-center text-body font-semibold text-ink dark:text-paper">Library stats</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
