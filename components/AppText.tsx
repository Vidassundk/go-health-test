import React, { forwardRef } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";

export type TypographyVariant = keyof typeof TYPOGRAPHY;

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

const AppText = forwardRef<Text, AppTextProps>(
  ({ variant = "body", style, color, ...props }, ref) => {
    const variantStyle = variant ? TYPOGRAPHY[variant] : undefined;

    return (
      <Text
        ref={ref}
        style={[
          { color: color ?? COLORS.text },
          variantStyle,
          StyleSheet.flatten(style),
        ]}
        {...props}
      />
    );
  }
);

AppText.displayName = "AppText";

export default AppText;
