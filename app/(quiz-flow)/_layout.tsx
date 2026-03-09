import { Header } from "@components";
import { selectQuizHeaderState, useQuizHeaderStore } from "@/stores";
import { Slot } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizFlowLayout() {
  const { progress, isBackDisabled, hideBackButton, onBackPress } = useQuizHeaderStore(
    useShallow(selectQuizHeaderState)
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.staticHeader} edges={["top"]}>
        <View style={styles.headerPadding}>
          <Header
            onBackPress={onBackPress}
            isBackDisabled={isBackDisabled}
            hideBackButton={hideBackButton}
            progress={progress}
          />
        </View>
      </SafeAreaView>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  staticHeader: {
    flexShrink: 0,
  },
  headerPadding: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
});
