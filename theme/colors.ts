export const colors = {
  // Brand palette
  primary: '#699BA9',    // Bleu Persan — brand / primary accents
  accent: '#FFC299',     // Pêche — CTA buttons
  coldViolet: '#4F4580', // Violet froid — dark headings, deep contrast
  lavender: '#BEB5DA',   // Lavande — secondary surfaces
  azure: '#DBE8F0',      // Azur — soft secondary background
  sandLight: '#FFE6D5',  // Sable clair — warm light background, cards
  peachSoft: '#FFD4B8',  // Pêche froid tint — soft surfaces

  // Functional
  white: '#FFFFFF',
  black: '#1A1A1A',
  textPrimary: '#4F4580',   // coldViolet for headings
  textSecondary: '#7B7B9B', // muted violet-gray
  textMuted: '#A0A0B8',
  border: '#E8E0F0',
  shadow: 'rgba(79, 69, 128, 0.08)',

  // Semantic
  success: '#7DB5A0',
  error: '#E07070',
} as const;

export type ColorKey = keyof typeof colors;
