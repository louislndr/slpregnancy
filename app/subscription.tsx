import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import AppHeader from '@/components/AppHeader';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const FREE_FEATURES: string[] = [
  'Access to all Support Now sessions',
  'Daily check-in',
  '5 full sessions per month',
  'Session history',
];

const PREMIUM_FEATURES: { label: string; icon: IoniconsName }[] = [
  { label: 'Unlimited sessions from the full library', icon: 'infinite-outline' },
  { label: 'All guided programs', icon: 'layers-outline' },
  { label: 'Audio downloads for offline use', icon: 'download-outline' },
  { label: 'Priority access to new sessions', icon: 'star-outline' },
  { label: 'Partner Connection sessions', icon: 'heart-outline' },
  { label: 'Advanced personalization', icon: 'options-outline' },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = () => {
    Alert.alert(
      'Premium Coming Soon',
      `The ${selectedPlan === 'monthly' ? '€9.99/month' : '€71.99/year'} plan will be available very soon. Thank you for your interest!`,
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <LinearGradient colors={[colors.azure, '#EEF4F8']} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="diamond-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSub}>Unlimited access to your full wellbeing journey</Text>
        </LinearGradient>

        {/* Premium features */}
        <Text style={styles.sectionTitle}>Everything in Premium</Text>
        <View style={styles.featuresCard}>
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={f.label} style={[styles.featureRow, i < PREMIUM_FEATURES.length - 1 && styles.featureRowBorder]}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingRow}>
          <TouchableOpacity
            style={[styles.priceCard, selectedPlan === 'monthly' && styles.priceCardHighlight]}
            activeOpacity={0.85}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Most popular</Text>
            </View>
            <Text style={styles.priceAmount}>€9.99</Text>
            <Text style={styles.pricePeriod}>per month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priceCard, selectedPlan === 'annual' && styles.priceCardHighlight]}
            activeOpacity={0.85}
            onPress={() => setSelectedPlan('annual')}
          >
            <Text style={styles.priceSave}>Save 40%</Text>
            <Text style={styles.priceAmount}>€71.99</Text>
            <Text style={styles.pricePeriod}>per year</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={handleSubscribe}>
          <Text style={styles.ctaBtnText}>Start 7-Day Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>Cancel anytime. No commitment.</Text>

        {/* What you have now */}
        <Text style={styles.sectionTitle}>Your current plan — Free</Text>
        <View style={styles.featuresCard}>
          {FREE_FEATURES.map((f, i) => (
            <View key={f} style={[styles.featureRow, i < FREE_FEATURES.length - 1 && styles.featureRowBorder]}>
              <Ionicons name="checkmark" size={16} color={colors.success} />
              <Text style={styles.featureLabelMuted}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  hero: { borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, ...shadow.card },
  heroTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, marginBottom: 6 },
  heroSub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },

  sectionTitle: { fontFamily: 'Raleway_700Bold', fontSize: 17, color: colors.coldViolet, marginBottom: spacing.sm, marginTop: spacing.md },

  featuresCard: { backgroundColor: colors.white, borderRadius: radius.md, marginBottom: spacing.lg, ...shadow.card, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  featureIconWrap: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.coldViolet, flex: 1 },
  featureLabelMuted: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, flex: 1 },

  pricingRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  priceCard: { flex: 1, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md, alignItems: 'center' },
  priceCardHighlight: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  popularBadge: { backgroundColor: colors.primary, borderRadius: 9999, paddingVertical: 3, paddingHorizontal: 10, marginBottom: spacing.sm },
  popularBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.white },
  priceSave: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.success, marginBottom: spacing.sm },
  priceAmount: { fontFamily: 'Raleway_700Bold', fontSize: 22, color: colors.coldViolet },
  pricePeriod: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted },

  ctaBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 16, alignItems: 'center', marginBottom: spacing.sm, ...shadow.button },
  ctaBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  ctaNote: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
});
