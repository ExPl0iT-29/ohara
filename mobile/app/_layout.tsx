import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";

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
  return (
    <ShareIntentProvider>
      <QueryClientProvider client={queryClient}>
        <ShareIntentRedirect />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="capture" options={{ presentation: "modal", headerShown: true, title: "Save a link" }} />
        </Stack>
      </QueryClientProvider>
    </ShareIntentProvider>
  );
}
