import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

const TAGS = ['Rest', 'Breathe', 'Let go', 'Be present'];

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <LinearGradient
      colors={['#F5F0FF', '#FFF8F4', colors.sandLight]}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      {/* Decorative background blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />

      <SafeAreaView style={styles.safe}>
        {/* Nav row */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={colors.coldViolet} />
          </TouchableOpacity>
          {hasCompleted && (
            <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
              <Ionicons name="close-outline" size={22} color={colors.coldViolet} />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Today's permission</Text>

          <Text style={styles.quoteMark}>"</Text>

          <Text style={styles.quote}>
            Today, I allow myself{'\n'}to take one day{'\n'}at a time.
          </Text>

          <View style={styles.tagRow}>
            {TAGS.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/first-session')} />
          <View style={styles.dots}><ProgressDots total={9} current={7} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  blobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.lavender,
    opacity: 0.3,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: 60,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.peachSoft,
    opacity: 0.4,
  },
  safe: { flex: 1, backgroundColor: 'transparent' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  navBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadow.card,
  },
  hero: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  quoteMark: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 110,
    color: colors.lavender,
    lineHeight: 90,
    marginBottom: -spacing.md,
    opacity: 0.8,
  },
  quote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 30,
    color: colors.coldViolet,
    lineHeight: 44,
    marginBottom: spacing.xxl,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  tagText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: colors.coldViolet,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  dots: { alignItems: 'center' },
});
