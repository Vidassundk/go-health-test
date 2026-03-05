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
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

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
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
