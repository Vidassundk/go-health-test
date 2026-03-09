import { GlowingBackground } from "@components";
import { GlowStoreInitializer } from "@/providers/GlowStoreInitializer";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export const STACK_SCREEN_OPTIONS = {
  headerShown: false,
  contentStyle: {
    backgroundColor: "transparent",
    paddingBottom: 20,
  },
  animation: "none" as const,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GlowStoreInitializer>
          <StatusBar style="light" />
          <GlowingBackground />
          {children}
        </GlowStoreInitializer>
      </SafeAreaProvider>
      <Toasts />
    </QueryClientProvider>
  );
}
