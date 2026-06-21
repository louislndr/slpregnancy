import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        showBack
        rightIcon={hasCompleted ? 'close-outline' : undefined}
        onRightPress={() => router.replace('/(tabs)')}
      />
      <ImageBackground
        source={require('@/assets/permission-bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.container}>

          {/* Title */}
          <Text style={styles.title}>Today's{'\n'}Permission</Text>

          {/* Quote */}
          <View style={styles.quoteArea}>
            <Text style={styles.quoteMark}>"</Text>
            <Text style={styles.quoteText}>
              Today, I allow{'\n'}myself to take{'\n'}one day at a time.
            </Text>
            <Ionicons name="heart" size={20} color={colors.accent} style={{ marginTop: spacing.xl }} />
          </View>

          <View style={{ flex: 1 }} />

          <PillButton label="Continue" onPress={() => router.push('/onboarding/first-session')} />
          <View style={styles.dots}><ProgressDots total={9} current={7} /></View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.sandLight },
  bg: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 34,
    color: colors.coldViolet,
    lineHeight: 43,
    marginBottom: spacing.xl,
    width: '65%',
  },
  quoteArea: {
    width: '70%',
  },
  quoteMark: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 56,
    color: colors.primary,
    lineHeight: 52,
    marginBottom: spacing.sm,
  },
  quoteText: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 26,
    color: colors.coldViolet,
    lineHeight: 38,
  },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
