import GlowingBackground from "@/components/GlowingBackground";
import { GlowProvider } from "@/contexts/GlowContext";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
} from "@expo-google-fonts/merriweather";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import {
  RedditSans_400Regular,
  RedditSans_600SemiBold,
  RedditSans_700Bold,
} from "@expo-google-fonts/reddit-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
    Poppins_400Regular,
    RedditSans_400Regular,
    RedditSans_600SemiBold,
    RedditSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <GlowProvider>
            <GlowingBackground />
            <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
                paddingHorizontal: 20,
                paddingBottom: 20,
              },
              animation: "none",
            }}
          >
              <Stack.Screen name="index" />
              <Stack.Screen name="home" />
              <Stack.Screen name="health-quiz" />
            </Stack>
            <StatusBar style="light" />
          </GlowProvider>
        </SafeAreaProvider>
        <Toasts />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
