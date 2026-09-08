import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const code = otp.join('');

  const handleDigit = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    if (code.length !== 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.verifyOtp({
      phone: phone ?? '',
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.session) {
      setSession(data.session);
      setInitialized();
      router.replace('/');
    }
  };

  const handleResend = async () => {
    await supabase.auth.signInWithOtp({ phone: phone ?? '' });
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <LinearGradient colors={['#FFF8F4', '#F5F0FF', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.content}>

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.coldViolet} />
            </TouchableOpacity>

            <Text style={styles.heading}>Enter the code</Text>
            <Text style={styles.subheading}>
              We sent a 6-digit code to{'\n'}
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}>{phone}</Text>
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(v) => handleDigit(v, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={i === 0}
                />
              ))}
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, (loading || code.length !== 6) && { opacity: 0.6 }]}
              onPress={handleVerify}
              activeOpacity={0.85}
              disabled={loading || code.length !== 6}
            >
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.primaryBtnText}>Verify</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={handleResend} disabled={resent}>
              <Text style={styles.resendText}>
                {resent ? 'Code resent!' : "Didn't receive it? Resend"}
              </Text>
            </TouchableOpacity>

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
  otpRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl },
  otpInput: {
    width: 46, height: 56, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.white,
    fontFamily: 'Raleway_700Bold', fontSize: 22, color: colors.coldViolet,
    textAlign: 'center', ...shadow.card,
  },
  otpInputFilled: { borderColor: colors.primary },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#FFF0F0', borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.md,
  },
  errorText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.error, flex: 1 },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 9999,
    paddingVertical: 16, alignItems: 'center', ...shadow.button, marginBottom: spacing.md,
  },
  primaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  resendBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  resendText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textMuted },
});
