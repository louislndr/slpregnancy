export const fonts = {
  heading: 'Raleway_700Bold',
  headingMedium: 'Raleway_500Medium',
  body: 'Montserrat_400Regular',
  bodyMedium: 'Montserrat_500Medium',
  bodySemiBold: 'Montserrat_600SemiBold',
  serif: 'PlayfairDisplay_400Regular',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',
} as const;

export const typography = {
  // Display — used for session/screen hero titles (serif)
  display: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.2,
  },

  // Headings — Raleway Bold
  h1: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.3,
  },

  // Body — Montserrat
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodySemiBold: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Eyebrow — small-caps label
  eyebrow: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  // Caption
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Button label
  button: {
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
} as const;
