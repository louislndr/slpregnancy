import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, Journey } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const WOMENS_JOURNEYS: { id: Journey; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 'trying-to-conceive',  icon: 'leaf-outline',        label: 'Trying to Conceive',       desc: 'Hoping for a baby, naturally'             },
  { id: 'fertility-treatment', icon: 'medical-outline',     label: 'Fertility Treatment',       desc: 'IVF, IUI or other assisted paths'         },
  { id: 'pregnancy',           icon: 'body-outline',        label: 'Pregnancy',                 desc: 'Expecting a baby'                         },
  { id: 'difficult-pregnancy', icon: 'alert-circle-outline',label: 'Difficult Pregnancy',       desc: 'High-risk, bed rest or complications'     },
  { id: 'waiting',             icon: 'time-outline',        label: 'Waiting',                   desc: 'Before a scan, exam or big decision'      },
  { id: 'birth-preparation',   icon: 'star-outline',        label: 'Preparing for Birth',       desc: 'Getting ready for your birth'             },
  { id: 'birth',               icon: 'flash-outline',       label: 'During Birth',              desc: 'Labour and delivery support'              },
  { id: 'pregnancy-recovery',  icon: 'flower-outline',      label: 'Pregnancy After Loss',      desc: 'Expecting again after a previous loss'    },
  { id: 'perinatal-grief',     icon: 'heart-outline',       label: 'Perinatal Grief',           desc: 'After a miscarriage, loss or termination' },
  { id: 'postpartum',          icon: 'happy-outline',       label: 'Postpartum',                desc: 'Life with your new baby'                  },
  { id: 'feeling-well',        icon: 'sunny-outline',       label: 'Feeling Well',              desc: 'No specific difficulty, just self-care'   },
];

const PARTNER_JOURNEYS: { id: Journey; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 'pregnancy',          icon: 'body-outline',    label: 'Supporting Pregnancy',      desc: 'My partner is expecting our baby'         },
  { id: 'trying-to-conceive', icon: 'leaf-outline',   label: 'Trying for a Baby',         desc: 'We are hoping to conceive'                },
  { id: 'postpartum',         icon: 'happy-outline',  label: 'Our Baby Has Arrived',      desc: 'Supporting after the birth'               },
  { id: 'perinatal-grief',    icon: 'heart-outline',  label: 'We Experienced a Loss',     desc: 'Supporting through grief together'        },
  { id: 'fertility-treatment',icon: 'medical-outline',label: 'Fertility Treatment',        desc: 'Supporting through treatment and waiting' },
];

export default function JourneyScreen() {
  const { profile, setJourney, hasCompletedOnboarding } = useOnboardingStore();
  const isPartner = profile.lounge === 'partner';
  const journeys = isPartner ? PARTNER_JOURNEYS : WOMENS_JOURNEYS;

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          showBack
          rightIcon={hasCompletedOnboarding ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>
          <Text style={styles.title}>
            {isPartner ? 'What are you\ngoing through?' : 'Tell us about\nyour journey'}
          </Text>
          <Text style={styles.subtitle}>Where are you right now?</Text>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.options}>
              {journeys.map((j) => {
                const active = profile.journey === j.id;
                return (
                  <TouchableOpacity
                    key={j.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => setJourney(j.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={j.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.label, active && styles.labelSelected]}>{j.label}</Text>
                      <Text style={styles.desc}>{j.desc}</Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/questions')} disabled={!profile.journey} />
          <View style={styles.dots}><ProgressDots total={10} current={3} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg, overflow: 'hidden' },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  scroll: { flex: 1, marginBottom: spacing.lg },
  options: { gap: 12, paddingBottom: spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, padding: spacing.md, gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primary },
  label: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  desc: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
