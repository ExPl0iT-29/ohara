import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLibraryStatsSummary } from "../src/api/content";
import { CONTENT_TYPE_LABELS } from "../src/constants/contentTypeLabels";

export default function StatsScreen() {
  const router = useRouter();
  const stats = getLibraryStatsSummary();

  return (
    <SafeAreaView className="flex-1 bg-paper dark:bg-surface-dark">
      <View className="gap-5 p-5">
        <Text className="text-display text-ink dark:text-paper">{stats.total}</Text>
        <Text className="text-caption text-ink-soft dark:text-ink-faint">total saved items</Text>

        <View className="gap-2">
          <Text className="text-title text-ink dark:text-paper">By status</Text>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <View key={status} className="flex-row justify-between">
              <Text className="text-body capitalize text-ink dark:text-paper">{status}</Text>
              <Text className="text-body text-ink-soft dark:text-ink-faint">{count}</Text>
            </View>
          ))}
        </View>

        <View className="gap-2">
          <Text className="text-title text-ink dark:text-paper">By type</Text>
          {Object.entries(stats.byContentType).map(([type, count]) => (
            <View key={type} className="flex-row justify-between">
              <Text className="text-body text-ink dark:text-paper">
                {CONTENT_TYPE_LABELS[type as keyof typeof CONTENT_TYPE_LABELS] ?? type}
              </Text>
              <Text className="text-body text-ink-soft dark:text-ink-faint">{count}</Text>
            </View>
          ))}
        </View>

        {stats.oldestUnread && (
          <View className="gap-1">
            <Text className="text-title text-ink dark:text-paper">Oldest unread</Text>
            <Text
              className="text-body text-brand"
              onPress={() => router.push(`/content/${stats.oldestUnread!.id}`)}
            >
              {stats.oldestUnread.title ?? stats.oldestUnread.url}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
