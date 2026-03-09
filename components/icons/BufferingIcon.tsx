import * as React from "react";
import Svg, { Path } from "react-native-svg";

type BufferIconProps = React.ComponentProps<typeof Svg> & {
  size?: number;
  color?: string;
};

export function BufferIcon({ size = 86, color = "#fff", ...props }: BufferIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 86 86" fill="none" {...props}>
      <Path
        d="M43 10a33 33 0 11-27.891 50.638l2.789-1.764A29.7 29.7 0 1043 13.3V10z"
        fill={color}
      />
    </Svg>
  );
}
