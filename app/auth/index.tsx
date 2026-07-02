import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

export default function AuthWelcomeScreen() {
  return (
    <LinearGradient
      colors={['#FFF8F4', '#F5F0FF', colors.sandLight]}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <View style={styles.content}>

          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>SL</Text>
          </View>
          <Text style={styles.appName}>SL Pregnancy</Text>
          <Text style={styles.tagline}>
            Your perinatal companion{'\n'}for every stage of the journey
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/auth/email')}
              activeOpacity={0.85}
            >
              <Ionicons name="mail-outline" size={20} color={colors.white} />
              <Text style={styles.primaryBtnText}>Continue with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/auth/phone')}
              activeOpacity={0.85}
            >
              <Ionicons name="phone-portrait-outline" size={20} color={colors.coldViolet} />
              <Text style={styles.secondaryBtnText}>Continue with Phone</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legal}>
            By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.card,
  },
  logoText: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet },
  appName: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 28,
    color: colors.coldViolet,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  buttons: { width: '100%', gap: spacing.md, marginBottom: spacing.xl },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: 9999,
    paddingVertical: 16,
    ...shadow.button,
  },
  primaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 9999,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  secondaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.coldViolet },
  legal: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
