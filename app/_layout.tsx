import { AppProviders, STACK_SCREEN_OPTIONS } from "@/providers";
import { useFontsReady } from "@/hooks/useFontsReady";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const ready = useFontsReady();

  if (!ready) {
    return null;
  }

  return (
    <AppProviders>
      <Stack screenOptions={STACK_SCREEN_OPTIONS} />
    </AppProviders>
  );
}
