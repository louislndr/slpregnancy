import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import ProgressDots from '@/components/ProgressDots';
import PillButton from '@/components/PillButton';
import AppHeader from '@/components/AppHeader';
import { useOnboardingStore } from '@/store/onboardingStore';
import { RecommendationEngine } from '@/services/RecommendationEngine';
import { Protocol } from '@/data/protocols';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type Step = 0 | 1 | 2 | 3 | 4 | 5;

const FEELINGS: { id: string; icon: IoniconsName; label: string }[] = [
  { id: 'struggling', icon: 'rainy-outline', label: "I'm Struggling" },
  { id: 'doing-okay', icon: 'partly-sunny-outline', label: 'Doing Okay' },
  { id: 'feeling-good', icon: 'sunny-outline', label: 'Feeling Good' },
  { id: 'preparing-tomorrow', icon: 'moon-outline', label: 'Preparing For Tomorrow' },
  { id: 'moment-for-myself', icon: 'flower-outline', label: 'I Just Want A Moment For Myself' },
];

const NEEDS: { id: string; icon: IoniconsName; label: string }[] = [
  { id: 'calm',             icon: 'water-outline',       label: 'Calm'                  },
  { id: 'reassurance',      icon: 'hand-left-outline',   label: 'Reassurance'           },
  { id: 'confidence',       icon: 'shield-outline',      label: 'Confidence'            },
  { id: 'rest',             icon: 'bed-outline',         label: 'Rest'                  },
  { id: 'connection',       icon: 'people-outline',      label: 'Connection'            },
  { id: 'welcome-emotions', icon: 'heart-outline',       label: 'Welcome My Emotions'   },
  { id: 'prepare',          icon: 'star-outline',        label: 'Prepare for Something' },
  { id: 'face-challenge',   icon: 'flame-outline',       label: 'Face a Challenge'      },
  { id: 'reconnect-self',   icon: 'person-outline',      label: 'Reconnect With Myself' },
  { id: 'develop-resources',icon: 'leaf-outline',        label: 'Develop My Resources'  },
];

const TIMES: { id: number; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 5, icon: 'flash-outline', label: '5 min', desc: 'Quick reset' },
  { id: 10, icon: 'time-outline', label: '10 min', desc: 'Short session' },
  { id: 15, icon: 'hourglass-outline', label: '15 min', desc: 'Full session' },
  { id: 20, icon: 'infinite-outline', label: '20+ min', desc: 'Deep practice' },
];

const POSITIONS: { id: string; icon: IoniconsName; label: string }[] = [
  { id: 'sitting', icon: 'body-outline', label: 'Sitting' },
  { id: 'standing', icon: 'walk-outline', label: 'Standing' },
  { id: 'lying', icon: 'bed-outline', label: 'Lying Down' },
];

const GUIDANCE: { id: string; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 'audio-only', icon: 'headset-outline', label: 'Audio Only', desc: 'Voice guidance only' },
  { id: 'audio-visual', icon: 'eye-outline', label: 'Audio + Visual', desc: 'Voice + breathing animations' },
];

function OptionRow({
  options,
  selected,
  onSelect,
}: {
  options: { id: string | number; icon: IoniconsName; label: string; desc?: string }[];
  selected: string | number | null;
  onSelect: (id: string | number) => void;
}) {
  return (
    <View style={styles.options}>
      {options.map((o) => {
        const active = selected === o.id;
        return (
          <TouchableOpacity
            key={String(o.id)}
            style={[styles.option, active && styles.optionSelected]}
            onPress={() => onSelect(o.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Ionicons name={o.icon as IoniconsName} size={20} color={active ? colors.white : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionLabel, active && styles.optionLabelSelected]}>
                {o.label}
              </Text>
              {o.desc && <Text style={styles.optionDesc}>{o.desc}</Text>}
            </View>
            {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ResultCard({ protocol, isPrimary }: { protocol: Protocol; isPrimary: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.resultCard, isPrimary && styles.resultCardPrimary]}
      onPress={() => router.replace(`/session/${protocol.id}`)}
      activeOpacity={0.85}
    >
      {isPrimary && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>✦ Recommended for you</Text>
        </View>
      )}
      <Text style={styles.resultTitle}>{protocol.title}</Text>
      <Text style={styles.resultMeta}>🎧 {protocol.duration} min · {protocol.contentType}</Text>
      <Text style={styles.resultDesc} numberOfLines={2}>{protocol.description}</Text>
      <View style={styles.resultCta}>
        <Text style={styles.resultCtaText}>{isPrimary ? 'Start Session →' : 'Try this instead →'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CheckInScreen() {
  const profile = useOnboardingStore((s) => s.profile);
  const [step, setStep] = useState<Step>(0);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [need, setNeed] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof RecommendationEngine.recommend> | null>(null);

  const goBack = () => {
    if (step === 0) { router.back(); return; }
    setStep((s) => (s - 1) as Step);
  };

  const goNext = () => {
    if (step === 4) {
      const rec = RecommendationEngine.recommend({
        journey: profile.journey ?? 'pregnancy',
        emotionalState: feeling ?? 'doing-okay',
        need: need ?? 'calm',
        availableTime: time ?? 10,
        position: position ?? 'sitting',
        guidanceMode: guidance ?? 'audio-visual',
        lounge: profile.lounge ?? 'womens',
      });
      setResult(rec);
      setStep(5);
    } else {
      setStep((s) => (s + 1) as Step);
    }
  };

  const canNext = () => {
    if (step === 0) return !!feeling;
    if (step === 1) return !!need;
    if (step === 2) return !!time;
    if (step === 3) return !!position;
    if (step === 4) return !!guidance;
    return false;
  };

  const STEPS = [
    { title: 'How are you\nfeeling today?', sub: 'There are no wrong answers here.' },
    { title: 'What do you\nneed most today?', sub: 'We\'ll find the right support for you.' },
    { title: 'How much time\ndo you have?', sub: 'Even 5 minutes makes a difference.' },
    { title: 'What\'s your\ncurrent position?', sub: 'We\'ll tailor the session for you.' },
    { title: 'How would you\nlike to be guided?', sub: 'You can always change this later.' },
  ];

  if (step === 5 && result) {
    return (
      <SafeAreaView style={styles.safe}>
        <AppHeader showBack />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.resultHeading}>Here's what we recommend</Text>
          <Text style={styles.resultSub}>Based on how you're feeling right now</Text>

          <ResultCard protocol={result.primary} isPrimary />

          {result.alternatives.length > 0 && (
            <>
              <Text style={styles.altHeading}>Or try one of these</Text>
              {result.alternatives.map((alt) => (
                <ResultCard key={alt.id} protocol={alt} isPrimary={false} />
              ))}
            </>
          )}

          {result.suggestedProgram && (
            <TouchableOpacity
              style={styles.programSuggestion}
              onPress={() => router.replace('/(tabs)/programs')}
              activeOpacity={0.85}
            >
              <Ionicons name="layers-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.programSuggestionTitle}>Start a Program</Text>
                <Text style={styles.programSuggestionSub}>{result.suggestedProgram.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const current = STEPS[step];

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader showBack onBackPress={goBack} />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.sub}>{current.sub}</Text>

          {step === 0 && (
            <OptionRow
              options={FEELINGS}
              selected={feeling}
              onSelect={(id) => setFeeling(String(id))}
            />
          )}
          {step === 1 && (
            <OptionRow
              options={NEEDS}
              selected={need}
              onSelect={(id) => setNeed(String(id))}
            />
          )}
          {step === 2 && (
            <OptionRow
              options={TIMES}
              selected={time}
              onSelect={(id) => setTime(Number(id))}
            />
          )}
          {step === 3 && (
            <OptionRow
              options={POSITIONS}
              selected={position}
              onSelect={(id) => setPosition(String(id))}
            />
          )}
          {step === 4 && (
            <OptionRow
              options={GUIDANCE}
              selected={guidance}
              onSelect={(id) => setGuidance(String(id))}
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          <PillButton
            label={step === 4 ? 'Find My Session' : 'Continue'}
            onPress={goNext}
            disabled={!canNext()}
          />
          <View style={styles.dots}>
            <ProgressDots total={5} current={step} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.sm },
  sub: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: 14, padding: spacing.md, gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primary },
  optionLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary },
  optionLabelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  optionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  dots: { alignItems: 'center', marginTop: spacing.md },

  // Result screen
  resultContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  resultHeading: { fontFamily: 'Raleway_700Bold', fontSize: 24, color: colors.coldViolet, marginBottom: 4 },
  resultSub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg },
  resultCard: {
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.md, ...shadow.card,
  },
  resultCardPrimary: { borderWidth: 2, borderColor: colors.primary },
  primaryBadge: {
    alignSelf: 'flex-start', backgroundColor: colors.azure,
    borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12, marginBottom: spacing.sm,
  },
  primaryBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary, letterSpacing: 0.3 },
  resultTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: colors.coldViolet, marginBottom: 4 },
  resultMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  resultDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  resultCta: {},
  resultCtaText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },
  altHeading: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.coldViolet, marginBottom: spacing.md },
  programSuggestion: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.sandLight, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.sm,
  },
  programSuggestionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.coldViolet },
  programSuggestionSub: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textSecondary },
});
