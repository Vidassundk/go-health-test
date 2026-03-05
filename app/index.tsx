import GlowingBackground from "@/components/GlowingBackground";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <GlowingBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07001C",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
