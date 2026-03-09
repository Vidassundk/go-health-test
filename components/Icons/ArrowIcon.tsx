import * as React from "react";
import Svg, { Path } from "react-native-svg";

type ArrowIconProps = React.ComponentProps<typeof Svg> & {
  size?: number;
  color?: string;
};

export function ArrowIcon({ size = 24, color = "#FDFCFE", ...props }: ArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M10.974 17.69a1 1 0 00.051-1.322l-.085-.092L7.5 13H19a1 1 0 00.117-1.993L19 11H7.5l3.44-3.276a1 1 0 00-1.283-1.529l-.097.08-5.297 5.049-.068.083-.077.12-.062.144-.03.098-.021.133L4 12l.012.158.025.112.058.156.058.106.067.093.09.1 5.25 5a1 1 0 001.414-.035z"
        fill={color}
      />
    </Svg>
  );
}
