import GlowingBackground from "@/components/GlowingBackground";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const { isLoading } = useQuizQuestions();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <GlowingBackground />
      <View style={styles.contentArea}>
        {isLoading && (
          <View style={styles.bufferingWrapper}>
            <SpinningBuffer size={30} color={COLORS.text} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 20,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
