import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 9999,
  },
  active: {
    width: 20,
    height: 6,
    backgroundColor: colors.primary,
  },
  inactive: {
    width: 6,
    height: 6,
    backgroundColor: colors.lavender,
  },
});
