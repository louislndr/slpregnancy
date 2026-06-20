import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.sub}>Coming soon — full session library with filters.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 24, color: colors.coldViolet, marginBottom: spacing.sm },
  sub: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});
