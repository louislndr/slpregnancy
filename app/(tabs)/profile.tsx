import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore, Journey, Lounge } from '@/store/onboardingStore';
import { useSessionStore, SessionHistory } from '@/store/sessionStore';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import AppHeader from '@/components/AppHeader';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const JOURNEY_LABELS: Record<Journey, string> = {
  'trying-to-conceive':  'Trying to Conceive',
  'fertility-treatment': 'Fertility Treatment',
  'pregnancy':           'Pregnancy',
  'difficult-pregnancy': 'Difficult Pregnancy',
  'waiting':             'Waiting',
  'birth-preparation':   'Preparing for Birth',
  'birth':               'During Birth',
  'pregnancy-recovery':  'Pregnancy After Loss',
  'perinatal-grief':     'Perinatal Grief',
  'postpartum':          'Postpartum',
  'feeling-well':        'Feeling Well',
  'partner-support':     'Partner Support',
};

const LOUNGE_LABELS: Record<Lounge, string> = {
  womens:  "Women's Lounge",
  partner: 'Partner Lounge',
  couple:  'Couple Lounge',
  kids:    'Kids Lounge',
  family:  'Family Lounge',
};

const WOMENS_JOURNEY_OPTIONS: { id: Journey; label: string; icon: IoniconsName }[] = [
  { id: 'trying-to-conceive',  label: 'Trying to Conceive',    icon: 'leaf-outline'         },
  { id: 'fertility-treatment', label: 'Fertility Treatment',    icon: 'medical-outline'      },
  { id: 'pregnancy',           label: 'Pregnancy',              icon: 'flower-outline'       },
  { id: 'difficult-pregnancy', label: 'Difficult Pregnancy',    icon: 'alert-circle-outline' },
  { id: 'waiting',             label: 'Waiting',                icon: 'time-outline'         },
  { id: 'birth-preparation',   label: 'Preparing for Birth',    icon: 'star-outline'         },
  { id: 'birth',               label: 'During Birth',           icon: 'flash-outline'        },
  { id: 'pregnancy-recovery',  label: 'Pregnancy After Loss',   icon: 'heart-outline'        },
  { id: 'perinatal-grief',     label: 'Perinatal Grief',        icon: 'heart-dislike-outline'},
  { id: 'postpartum',          label: 'Postpartum',             icon: 'sunny-outline'        },
  { id: 'feeling-well',        label: 'Feeling Well',           icon: 'happy-outline'        },
];

const PARTNER_JOURNEY_OPTIONS: { id: Journey; label: string; icon: IoniconsName }[] = [
  { id: 'pregnancy',           label: 'Supporting Pregnancy',   icon: 'body-outline'         },
  { id: 'trying-to-conceive',  label: 'Trying for a Baby',      icon: 'leaf-outline'         },
  { id: 'postpartum',          label: 'Our Baby Has Arrived',   icon: 'happy-outline'        },
  { id: 'perinatal-grief',     label: 'We Experienced a Loss',  icon: 'heart-outline'        },
  { id: 'fertility-treatment', label: 'Fertility Treatment',     icon: 'medical-outline'      },
];

function SettingRow({
  icon, label, value, onPress, danger,
}: {
  icon: IoniconsName; label: string; value?: string; onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <View style={styles.settingIconWrap}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={16} color={danger ? colors.error : colors.textMuted} />}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function ProfileScreen() {
  const profile = useOnboardingStore((s) => s.profile);
  const setJourney = useOnboardingStore((s) => s.setJourney);
  const setGuidanceVoice = useOnboardingStore((s) => s.setGuidanceVoice);
  const setGuidanceMode = useOnboardingStore((s) => s.setGuidanceMode);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);
  const protocols = useDataStore((s) => s.protocols);
  const signOut = useAuthStore((s) => s.signOut);

  const history = useSessionStore((s) => s.history);
  const favorites = useSessionStore((s) => s.favorites);

  const sessionCount = history.length;
  const favoritesCount = favorites.length;

  const streak = React.useMemo(() => {
    if (history.length === 0) return 0;
    const dates = [...new Set(history.map((h) => h.completedAt.split('T')[0]))].sort().reverse();
    let count = 0;
    let check = new Date().toISOString().split('T')[0];
    for (const date of dates) {
      if (date === check) {
        count++;
        const d = new Date(check);
        d.setDate(d.getDate() - 1);
        check = d.toISOString().split('T')[0];
      } else break;
    }
    return count;
  }, [history]);

  const journeyLabel = profile.journey ? JOURNEY_LABELS[profile.journey] : 'Not set';
  const loungeLabel = profile.lounge ? LOUNGE_LABELS[profile.lounge] : null;
  const isPartner = profile.lounge === 'partner';
  const journeyOptions = isPartner ? PARTNER_JOURNEY_OPTIONS : WOMENS_JOURNEY_OPTIONS;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(profile.firstName || 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.heroName}>{profile.firstName || 'Welcome'}</Text>
          <View style={styles.badgeRow}>
            {loungeLabel && (
              <View style={styles.loungeBadge}>
                <Text style={styles.loungeBadgeText}>{loungeLabel}</Text>
              </View>
            )}
            <View style={styles.journeyBadge}>
              <Text style={styles.journeyBadgeText}>{journeyLabel}</Text>
            </View>
          </View>
        </View>

        {/* Stats row + My Journey history */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{sessionCount}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Recent Sessions */}
        {history.length > 0 && (
          <>
            <SectionHeader title="Recent Sessions" />
            <View style={styles.card}>
              {history.slice(0, 5).map((h: SessionHistory, i: number) => {
                const p = protocols.find((pr) => pr.id === h.protocolId);
                const date = new Date(h.completedAt);
                const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                const moodEmoji = h.feelingAfter === 'much-calmer' ? '🌸'
                  : h.feelingAfter === 'lighter' ? '☁️'
                  : h.feelingAfter === 'reflective' ? '🌙'
                  : h.feelingAfter === 'same' ? '🌿'
                  : h.feelingAfter === 'need-more' ? '💙' : '✦';
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.sessionRow, i < Math.min(history.length, 5) - 1 && styles.sessionRowBorder]}
                    onPress={() => router.push(`/session/${h.protocolId}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.sessionEmojiWrap}>
                      <Text style={styles.sessionEmoji}>{moodEmoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sessionTitle} numberOfLines={1}>
                        {p?.title ?? h.protocolId}
                      </Text>
                      {h.emotion && (
                        <Text style={styles.sessionEmotion}>{h.emotion}</Text>
                      )}
                    </View>
                    <Text style={styles.sessionDate}>{dateStr}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Change Journey */}
        <SectionHeader title="My Journey" />
        <View style={styles.card}>
          {journeyOptions.map((opt, i) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.journeyOption,
                profile.journey === opt.id && styles.journeyOptionActive,
                i < journeyOptions.length - 1 && styles.journeyOptionBorder,
              ]}
              onPress={() => setJourney(opt.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.journeyIconWrap, profile.journey === opt.id && styles.journeyIconWrapActive]}>
                <Ionicons name={opt.icon} size={16} color={profile.journey === opt.id ? colors.white : colors.primary} />
              </View>
              <Text style={[styles.journeyOptionLabel, profile.journey === opt.id && styles.journeyOptionLabelActive]}>
                {opt.label}
              </Text>
              {profile.journey === opt.id && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Guidance Preferences */}
        <SectionHeader title="Guidance Preferences" />
        <View style={styles.card}>
          <View style={styles.preferenceRow}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="mic-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Voice</Text>
            <View style={styles.voiceToggle}>
              <TouchableOpacity
                style={[styles.voiceBtn, profile.guidanceVoice === 'female' && styles.voiceBtnActive]}
                onPress={() => setGuidanceVoice('female')}
              >
                <Text style={[styles.voiceBtnText, profile.guidanceVoice === 'female' && styles.voiceBtnTextActive]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.voiceBtn, profile.guidanceVoice === 'male' && styles.voiceBtnActive]}
                onPress={() => setGuidanceVoice('male')}
              >
                <Text style={[styles.voiceBtnText, profile.guidanceVoice === 'male' && styles.voiceBtnTextActive]}>Male</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.preferenceRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="eye-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Mode</Text>
            <View style={styles.voiceToggle}>
              <TouchableOpacity
                style={[styles.voiceBtn, profile.guidanceMode === 'audio-only' && styles.voiceBtnActive]}
                onPress={() => setGuidanceMode('audio-only')}
              >
                <Text style={[styles.voiceBtnText, profile.guidanceMode === 'audio-only' && styles.voiceBtnTextActive]}>Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.voiceBtn, profile.guidanceMode === 'audio-visual' && styles.voiceBtnActive]}
                onPress={() => setGuidanceMode('audio-visual')}
              >
                <Text style={[styles.voiceBtnText, profile.guidanceMode === 'audio-visual' && styles.voiceBtnTextActive]}>Visual</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={styles.card}>
          <SettingRow icon="help-circle-outline" label="What is Sophrology?" onPress={() => router.push('/sophrology')} />
          <View style={styles.rowDivider} />
          <SettingRow icon="diamond-outline" label="Go Premium" value="Free" onPress={() => router.push('/subscription')} />
        </View>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={styles.card}>
          <SettingRow
            icon="refresh-outline"
            label="Restart Onboarding"
            onPress={() => { resetOnboarding(); router.replace('/onboarding/welcome'); }}
            danger
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="log-out-outline"
            label="Sign Out"
            onPress={() => { resetOnboarding(); signOut(); }}
            danger
          />
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9F7FF' },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 },

  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { fontFamily: 'Raleway_700Bold', fontSize: 30, color: colors.coldViolet },
  heroName: { fontFamily: 'Raleway_700Bold', fontSize: 22, color: colors.coldViolet, marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
  loungeBadge: { backgroundColor: colors.lavender, borderRadius: 9999, paddingVertical: 6, paddingHorizontal: 16 },
  loungeBadgeText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.coldViolet },
  journeyBadge: { backgroundColor: colors.azure, borderRadius: 9999, paddingVertical: 6, paddingHorizontal: 16 },
  journeyBadgeText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.primary },

  statsRow: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, ...shadow.card },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontFamily: 'Raleway_700Bold', fontSize: 24, color: colors.coldViolet },
  statLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },

  sectionHeader: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radius.md, marginBottom: spacing.md, ...shadow.card, overflow: 'hidden' },

  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  settingIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet },
  settingLabelDanger: { color: colors.error },
  settingValue: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginRight: 4 },
  rowDivider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 34 + spacing.md },

  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  sessionRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  sessionEmojiWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sandLight, alignItems: 'center', justifyContent: 'center' },
  sessionEmoji: { fontSize: 16 },
  sessionTitle: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.coldViolet },
  sessionEmotion: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 1 },
  sessionDate: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted },
  journeyOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  journeyOptionActive: { backgroundColor: '#F0F7FA' },
  journeyOptionBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  journeyIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center' },
  journeyIconWrapActive: { backgroundColor: colors.primary },
  journeyOptionLabel: { flex: 1, fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet },
  journeyOptionLabelActive: { fontFamily: 'Montserrat_600SemiBold' },

  preferenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  voiceToggle: { flexDirection: 'row', backgroundColor: colors.azure, borderRadius: 9999, padding: 3, gap: 2 },
  voiceBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9999 },
  voiceBtnActive: { backgroundColor: colors.white },
  voiceBtnText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.textMuted },
  voiceBtnTextActive: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
});
