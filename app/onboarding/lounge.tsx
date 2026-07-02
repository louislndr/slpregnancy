import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, Lounge } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const LOUNGES: {
  id: Lounge;
  icon: IoniconsName;
  label: string;
  desc: string;
  available: boolean;
}[] = [
  { id: 'womens',  icon: 'flower-outline',  label: "Women's Lounge", desc: 'Your personal accompaniment space',       available: true },
  { id: 'partner', icon: 'person-outline',  label: 'Partner Lounge', desc: 'Supporting your partner on this journey', available: true },
  { id: 'couple',  icon: 'people-outline',  label: 'Couple Lounge',  desc: 'Navigating this journey together',        available: false },
  { id: 'kids',    icon: 'happy-outline',   label: 'Kids Lounge',    desc: 'Helping siblings welcome the baby',       available: false },
  { id: 'family',  icon: 'home-outline',    label: 'Family Lounge',  desc: 'Supporting the whole family',             available: false },
];

export default function LoungeScreen() {
  const { profile, setLounge } = useOnboardingStore();
  const selected = profile.lounge;

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader showBack />
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to{'\n'}SL Pregnancy</Text>
          <Text style={styles.subtitle}>Choose your Lounge to begin.</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.options}>
              {LOUNGES.map((lounge) => {
                const active = selected === lounge.id;
                return (
                  <TouchableOpacity
                    key={lounge.id}
                    style={[
                      styles.option,
                      active && styles.optionSelected,
                      !lounge.available && styles.optionDisabled,
                    ]}
                    onPress={() => lounge.available && setLounge(lounge.id)}
                    activeOpacity={lounge.available ? 0.8 : 1}
                  >
                    <View style={[
                      styles.iconWrap,
                      active && styles.iconWrapActive,
                      !lounge.available && styles.iconWrapDisabled,
                    ]}>
                      <Ionicons
                        name={lounge.icon}
                        size={20}
                        color={active ? colors.white : !lounge.available ? colors.textMuted : colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        styles.label,
                        active && styles.labelSelected,
                        !lounge.available && styles.labelDisabled,
                      ]}>
                        {lounge.label}
                      </Text>
                      <Text style={styles.desc}>{lounge.desc}</Text>
                    </View>
                    {!lounge.available && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Soon</Text>
                      </View>
                    )}
                    {active && lounge.available && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <PillButton
            label="Continue"
            onPress={() => router.push('/onboarding/support-needs')}
            disabled={!selected}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  scroll: { flex: 1, marginBottom: spacing.lg },
  options: { gap: 12, paddingBottom: spacing.md },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, padding: spacing.md, gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  optionDisabled: { opacity: 0.5 },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primary },
  iconWrapDisabled: { backgroundColor: colors.border },
  label: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  labelDisabled: { color: colors.textMuted },
  desc: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  comingSoonBadge: { backgroundColor: colors.lavender, borderRadius: 9999, paddingVertical: 3, paddingHorizontal: 10 },
  comingSoonText: { fontFamily: 'Montserrat_500Medium', fontSize: 11, color: colors.coldViolet },
});
