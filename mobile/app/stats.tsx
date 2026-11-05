import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { getLibraryStatsSummary } from "../src/api/content";
import { CONTENT_TYPE_LABELS } from "../src/constants/contentTypeLabels";
import { Card } from "../src/components/ui/Card";
import { Screen } from "../src/components/ui/Screen";

export default function StatsScreen() {
  const router = useRouter();
  const stats = getLibraryStatsSummary();

  return (
    <Screen>
      <View className="gap-5 p-5">
        <Text className="font-heading text-display text-ink dark:text-paper">{stats.total}</Text>
        <Text className="font-ui text-caption text-ink-soft dark:text-ink-faint">total saved items</Text>

        <Card className="gap-2 p-4">
          <Text className="font-heading text-title text-ink dark:text-paper">By status</Text>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <View key={status} className="flex-row justify-between">
              <Text className="font-ui text-body capitalize text-ink dark:text-paper">{status}</Text>
              <Text className="font-ui text-body font-bold text-ink-soft dark:text-ink-faint">{count}</Text>
            </View>
          ))}
        </Card>

        <Card className="gap-2 p-4">
          <Text className="font-heading text-title text-ink dark:text-paper">By type</Text>
          {Object.entries(stats.byContentType).map(([type, count]) => (
            <View key={type} className="flex-row justify-between">
              <Text className="font-ui text-body text-ink dark:text-paper">
                {CONTENT_TYPE_LABELS[type as keyof typeof CONTENT_TYPE_LABELS] ?? type}
              </Text>
              <Text className="font-ui text-body font-bold text-ink-soft dark:text-ink-faint">{count}</Text>
            </View>
          ))}
        </Card>

        {stats.oldestUnread && (
          <Card className="gap-1 p-4">
            <Text className="font-heading text-title text-ink dark:text-paper">Oldest unread</Text>
            <Text
              className="font-ui text-body font-bold text-ink underline"
              onPress={() => router.push(`/content/${stats.oldestUnread!.id}`)}
            >
              {stats.oldestUnread.title ?? stats.oldestUnread.url}
            </Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
