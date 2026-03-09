import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { AppText, ScreenWithBottomAction } from "@components";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

type LandingScreenViewProps = {
  isVisible: boolean;
  isTransitioning: boolean;
  entering: React.ComponentProps<typeof Animated.View>["entering"];
  exiting: React.ComponentProps<typeof Animated.View>["exiting"];
  onNext: () => void;
};

export function LandingScreenView({
  isVisible,
  isTransitioning,
  entering,
  exiting,
  onNext,
}: LandingScreenViewProps) {
  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: locale.common.next,
              disabled: isTransitioning,
              onPress: onNext,
            }}
          >
            <View style={styles.contentArea}>
              <View style={styles.appGreetingSection}>
                <AppText variant="display">{locale.home.greeting}</AppText>
                <AppText color={COLORS.textAlt} style={styles.subtext} variant="bodyCompact">
                  {locale.home.subtext}
                </AppText>
              </View>
            </View>
          </ScreenWithBottomAction>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
  },
  appGreetingSection: {
    gap: 24,
    alignItems: "center",
  },
  subtext: {
    textAlign: "center",
  },
});
