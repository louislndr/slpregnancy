import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';

interface EyebrowProps {
  label: string;
  color?: string;
}

export default function Eyebrow({ label, color = colors.textMuted }: EyebrowProps) {
  return <Text style={[styles.text, { color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.eyebrow,
  },
});
