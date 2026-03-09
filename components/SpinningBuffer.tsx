import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { BufferIcon } from "@icons";

type SpinningBufferProps = Parameters<typeof BufferIcon>[0];

export function SpinningBuffer({ size = 86, color = "#fff", ...props }: SpinningBufferProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const center = size / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    transformOrigin: [center, center, 0],
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { width: size, height: size }]}>
      <BufferIcon size={size} color={color} {...props} />
    </Animated.View>
  );
}
