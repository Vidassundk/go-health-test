import React, { forwardRef } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { TYPOGRAPHY } from "@/constants/typography";

export type TypographyVariant = keyof typeof TYPOGRAPHY;

const DEFAULT_COLOR = "#FDFCFE";

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
};

const AppText = forwardRef<Text, AppTextProps>(
  ({ variant = "body", style, ...props }, ref) => {
    const variantStyle = variant ? TYPOGRAPHY[variant] : undefined;

    return (
      <Text
        ref={ref}
        style={[
          { color: DEFAULT_COLOR },
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
