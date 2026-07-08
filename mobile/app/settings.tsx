import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { exportBackup, importBackup } from "../src/backup/backup";

export default function SettingsScreen() {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

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
    <SafeAreaView className="flex-1 bg-paper">
      <View className="gap-4 p-5">
        <Text className="text-title text-ink">Backup</Text>
        <Text className="text-body text-ink-soft">
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
          className="rounded-card border border-line bg-white p-4 active:opacity-80 disabled:opacity-40"
          disabled={busy}
          onPress={handleImport}
        >
          <Text className="text-center text-body font-semibold text-ink">Import from file</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
