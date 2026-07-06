import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="capture" options={{ presentation: "modal", title: "Save a link" }} />
      </Stack>
    </QueryClientProvider>
  );
}
