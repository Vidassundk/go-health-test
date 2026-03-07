import * as React from "react";
import Svg, { Path } from "react-native-svg";

type CheckIconProps = React.ComponentProps<typeof Svg> & {
  size?: number;
  color?: string;
};

export function CheckIcon({
  size = 10,
  color = "#03123D",
  ...props
}: CheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 8" fill="none" {...props}>
      <Path
        d="M3.53 8L0 4.308l1.176-1.231L3.53 5.539 8.824 0 10 1.23 3.53 8z"
        fill={color}
      />
    </Svg>
  );
}
