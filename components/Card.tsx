import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'sand' | 'azure' | 'lavender' | 'peach';
  padding?: number;
}

const variantColors: Record<string, string> = {
  default: colors.white,
  sand: colors.sandLight,
  azure: colors.azure,
  lavender: colors.lavender,
  peach: colors.peachSoft,
};

export default function Card({
  children,
  style,
  variant = 'default',
  padding = spacing.md,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: variantColors[variant], padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    ...shadow.card,
  },
});
