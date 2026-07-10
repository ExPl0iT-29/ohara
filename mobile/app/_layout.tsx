import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";

import { getSetting } from "../src/db/settings";
import { reprocessStuckContent } from "../src/processing/processContent";

const queryClient = new QueryClient();

function ShareIntentRedirect() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent) return;
    const url = shareIntent.webUrl ?? shareIntent.text;
    if (url) {
      router.push({ pathname: "/capture", params: { url } });
    }
    resetShareIntent();
  }, [hasShareIntent, shareIntent, resetShareIntent, router]);

  return null;
}

export default function RootLayout() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    // ponytail: if the app was killed mid-extraction, sweep and retry stuck rows on next launch
    void reprocessStuckContent();

    const savedTheme = getSetting("theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setColorScheme(savedTheme);
    }
  }, [setColorScheme]);

  const headerOptions = {
    headerStyle: { backgroundColor: isDark ? "#161412" : "#FAF9F6" },
    headerTintColor: isDark ? "#FAF9F6" : "#1C1917",
    headerTitleStyle: { color: isDark ? "#FAF9F6" : "#1C1917" },
  };

  return (
    <ShareIntentProvider>
      <QueryClientProvider client={queryClient}>
        <ShareIntentRedirect />
        <Stack screenOptions={{ headerShown: false, ...headerOptions }}>
          <Stack.Screen
            name="capture"
            options={{ presentation: "modal", headerShown: true, title: "Save a link", ...headerOptions }}
          />
          <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings", ...headerOptions }} />
          <Stack.Screen name="stats" options={{ headerShown: true, title: "Stats", ...headerOptions }} />
        </Stack>
      </QueryClientProvider>
    </ShareIntentProvider>
  );
}
