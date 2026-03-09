import { Merriweather_400Regular, Merriweather_700Bold } from "@expo-google-fonts/merriweather";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import {
  RedditSans_400Regular,
  RedditSans_600SemiBold,
  RedditSans_700Bold,
} from "@expo-google-fonts/reddit-sans";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { locale } from "@/constants/locale";
import { showErrorToast } from "@/components/feedback/toast";

const FONTS = {
  Merriweather_400Regular,
  Merriweather_700Bold,
  Poppins_400Regular,
  RedditSans_400Regular,
  RedditSans_600SemiBold,
  RedditSans_700Bold,
};

/** Loads app fonts and hides splash when ready or on error. */
export function useFontsReady(): boolean {
  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      if (fontError) {
        showErrorToast(
          fontError instanceof Error ? fontError.message : locale.fontErrors.loadFailed
        );
      }
    }
  }, [fontsLoaded, fontError]);

  return Boolean(fontsLoaded || fontError);
}
