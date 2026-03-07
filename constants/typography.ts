import { TextStyle } from "react-native";

export const FONTS = {
  merriweather: {
    regular: "Merriweather_400Regular",
    bold: "Merriweather_700Bold",
  },
  redditSans: {
    regular: "RedditSans_400Regular",
    semiBold: "RedditSans_600SemiBold",
    bold: "RedditSans_700Bold",
  },
  poppins: {
    regular: "Poppins_400Regular",
  },
} as const;

export const TYPOGRAPHY_VARIANTS = [
  "display",
  "heading",
  "headingBold",
  "body",
  "bodyBold",
  "bodyCompact",
  "headingSemiRight",
  "caption",
] as const;

export type TypographyVariant = (typeof TYPOGRAPHY_VARIANTS)[number];

export const TYPOGRAPHY: Record<TypographyVariant, TextStyle> = {
  display: {
    fontFamily: FONTS.merriweather.regular,
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: "center",
  },

  heading: {
    fontFamily: FONTS.merriweather.regular,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
  },

  headingBold: {
    fontFamily: FONTS.merriweather.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
  },

  body: {
    fontFamily: FONTS.redditSans.regular,
    fontSize: 15,
    letterSpacing: -0.24,
  },

  bodyBold: {
    fontFamily: FONTS.redditSans.bold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },

  bodyCompact: {
    fontFamily: FONTS.redditSans.regular,
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: -0.24,
  },

  headingSemiRight: {
    fontFamily: FONTS.redditSans.semiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    textAlign: "right",
  },

  caption: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
};
