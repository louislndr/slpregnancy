import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    setError(null);
    const normalized = phone.trim().replace(/\s/g, '');
    if (!normalized.startsWith('+') || normalized.length < 8) {
      setError('Enter your number in international format (e.g. +33612345678).');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push(`/auth/otp?phone=${encodeURIComponent(normalized)}`);
  };

  return (
    <LinearGradient colors={['#FFF8F4', '#F5F0FF', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.content}>

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.coldViolet} />
            </TouchableOpacity>

            <Text style={styles.heading}>Enter your{'\n'}phone number</Text>
            <Text style={styles.subheading}>
              We'll send you a one-time code to verify your number.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+33 6 12 34 56 78"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="done"
                  onSubmitEditing={handleSendCode}
                />
                <Text style={styles.hint}>Include your country code (e.g. +1, +33, +44)</Text>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSendCode}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color={colors.white} />
                  : <Text style={styles.primaryBtnText}>Send Code</Text>
                }
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl, ...shadow.card,
  },
  heading: {
    fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet,
    lineHeight: 36, marginBottom: spacing.sm,
  },
  subheading: {
    fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary,
    lineHeight: 22, marginBottom: spacing.xl,
  },
  form: { gap: spacing.md },
  inputWrap: { gap: 6 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textSecondary },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: colors.border, padding: spacing.md,
    fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary,
    ...shadow.card,
  },
  hint: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#FFF0F0', borderRadius: radius.sm, padding: spacing.md,
  },
  errorText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.error, flex: 1 },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 9999,
    paddingVertical: 16, alignItems: 'center', ...shadow.button,
  },
  primaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
});
