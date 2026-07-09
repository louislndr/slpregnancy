import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

type Mode = 'signin' | 'signup';

export default function EmailAuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState(false);

  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);

    if (mode === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { first_name: name.trim() || undefined } },
      });
      setLoading(false);
      if (err) { setError(err.message); return; }
      if (data.session) {
        if (name.trim()) useOnboardingStore.getState().setFirstName(name.trim());
        setSession(data.session);
        setInitialized();
        router.replace('/');
      } else {
        if (name.trim()) useOnboardingStore.getState().setFirstName(name.trim());
        setConfirmation(true);
      }
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (err) { setError(err.message); return; }
      if (data.session) {
        setSession(data.session);
        setInitialized();
        router.replace('/');
      }
    }
  };

  if (confirmation) {
    return (
      <LinearGradient colors={['#FFF8F4', '#F5F0FF', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          <View style={styles.confirmationWrap}>
            <Ionicons name="mail-open-outline" size={48} color={colors.primary} />
            <Text style={styles.confirmTitle}>Check your email</Text>
            <Text style={styles.confirmBody}>
              We sent a confirmation link to{'\n'}
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}>{email}</Text>
              {'\n\n'}Click the link to verify your account, then come back to sign in.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => { setConfirmation(false); setMode('signin'); }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Go to Sign In</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFF8F4', '#F5F0FF', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.coldViolet} />
            </TouchableOpacity>

            <Text style={styles.heading}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </Text>
            <Text style={styles.subheading}>
              {mode === 'signin'
                ? 'Sign in to continue your journey'
                : 'Start your perinatal companion journey'}
            </Text>

            {/* Mode toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
                onPress={() => { setMode('signin'); setError(null); }}
              >
                <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
                onPress={() => { setMode('signup'); setError(null); }}
              >
                <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {mode === 'signup' && (
                <View style={styles.inputWrap}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your first name"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              )}

              <View style={styles.inputWrap}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrap}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordWrap}>
                  <TextInput
                    style={[styles.input, { flex: 1, borderWidth: 0 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color={colors.white} />
                  : <Text style={styles.primaryBtnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
                }
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
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
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.azure,
    borderRadius: 9999,
    padding: 4,
    marginBottom: spacing.xl,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9999 },
  toggleBtnActive: { backgroundColor: colors.white, ...shadow.card },
  toggleText: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.textMuted },
  toggleTextActive: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  form: { gap: spacing.md },
  inputWrap: { gap: 6 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textSecondary },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: colors.border, padding: spacing.md,
    fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary,
    ...shadow.card,
  },
  passwordWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, ...shadow.card,
  },
  eyeBtn: { padding: spacing.md },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#FFF0F0', borderRadius: radius.sm, padding: spacing.md,
  },
  errorText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.error, flex: 1 },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 9999,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.md, ...shadow.button,
  },
  primaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  confirmationWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg,
  },
  confirmTitle: {
    fontFamily: 'Raleway_700Bold', fontSize: 24, color: colors.coldViolet,
    marginTop: spacing.lg, marginBottom: spacing.md,
  },
  confirmBody: {
    fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl,
  },
});
