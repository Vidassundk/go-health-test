import AppText from "@components/AppText";
import { ErrorIcon } from "@icons";
import { COLORS } from "@/constants/colors";
import { resolveValue, toast, type Toast } from "@backpackapp-io/react-native-toast";
import { Dimensions, View } from "react-native";

const SCREEN_PADDING = 32;

export function showErrorToast(message: string) {
  toast.error(message, {
    maxWidth: Dimensions.get("window").width - SCREEN_PADDING,
    customToast: (t: Toast) => {
      const resolved = resolveValue(t.message, t);
      const text = typeof resolved === "string" ? resolved : "";
      return (
        <View style={{ width: t.width, alignItems: "center" }}>
          <View
            style={{
              backgroundColor: COLORS.error,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 8,
              width: t.width ? t.width - 60 : undefined,
            }}
          >
            <ErrorIcon size={16} color="#fff" />
            <AppText variant="caption" color="#fff" style={{ flex: 1, textAlign: "left" }}>
              {text}
            </AppText>
          </View>
        </View>
      );
    },
  });
}
