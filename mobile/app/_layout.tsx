import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { InteractionManager } from "react-native";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { getSetting } from "../src/db/settings";
import { reprocessStuckContent } from "../src/processing/processContent";
import { logSinceBundleStart } from "../src/perf";

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

function OnboardingRedirect() {
  const router = useRouter();
  const { hasShareIntent } = useShareIntentContext();

  useEffect(() => {
    // ponytail: skips onboarding for this launch if a share intent is already in flight,
    // to avoid competing with ShareIntentRedirect's push to /capture.
    if (hasShareIntent) return;
    if (getSetting("onboarding_complete") !== "1") {
      router.replace("/onboarding");
    }
  }, [hasShareIntent, router]);

  return null;
}

export default function RootLayout() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    logSinceBundleStart("RootLayout mounted");

    // Deferred until after first paint/interactions so the initial feed render isn't
    // competing with network fetches + AI enrichment for stuck rows on launch.
    const task = InteractionManager.runAfterInteractions(() => {
      void reprocessStuckContent();
    });

    const savedTheme = getSetting("theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setColorScheme(savedTheme);
    }

    return () => task.cancel();
  }, [setColorScheme]);

  const headerOptions = {
    headerStyle: { backgroundColor: isDark ? "#161412" : "#FAF9F6" },
    headerTintColor: isDark ? "#FAF9F6" : "#1C1917",
    headerTitleStyle: { color: isDark ? "#FAF9F6" : "#1C1917" },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ShareIntentProvider>
        <QueryClientProvider client={queryClient}>
          <ShareIntentRedirect />
          <OnboardingRedirect />
          <Stack screenOptions={{ headerShown: false, animation: "none", ...headerOptions }}>
            <Stack.Screen
              name="capture"
              options={{ presentation: "modal", headerShown: true, title: "Save a link", ...headerOptions }}
            />
            <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings", ...headerOptions }} />
            <Stack.Screen name="stats" options={{ headerShown: true, title: "Stats", ...headerOptions }} />
          </Stack>
        </QueryClientProvider>
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
}
