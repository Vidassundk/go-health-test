import { COLORS } from "@/constants/colors";
import { AppText, ScreenWithBottomAction } from "@components";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

type HomeScreenViewProps = {
  isVisible: boolean;
  isTransitioning: boolean;
  entering: React.ComponentProps<typeof Animated.View>["entering"];
  exiting: React.ComponentProps<typeof Animated.View>["exiting"];
  title: string;
  text: string;
  startOverLabel: string;
  onStartOver: () => void;
};

export function HomeScreenView({
  isVisible,
  isTransitioning,
  entering,
  exiting,
  title,
  text,
  startOverLabel,
  onStartOver,
}: HomeScreenViewProps) {
  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: startOverLabel,
              disabled: isTransitioning,
              onPress: onStartOver,
            }}
          >
            <View style={styles.contentArea}>
              <View style={styles.appGreetingSection}>
                <AppText variant="display">{title}</AppText>
                <AppText color={COLORS.textAlt} style={styles.subtext} variant="bodyCompact">
                  {text}
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
