import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useSessionStore } from '@/store/sessionStore';
import { protocols } from '@/data/protocols';

const MOODS = [
  { id: 'much-calmer', emoji: '🌸', label: 'Much calmer' },
  { id: 'lighter', emoji: '☁️', label: 'Lighter' },
  { id: 'same', emoji: '🌿', label: 'About the same' },
  { id: 'reflective', emoji: '🌙', label: 'Reflective' },
  { id: 'need-more', emoji: '💙', label: 'Need more support' },
];

export default function SessionFeedbackScreen() {
  const { protocolId, sessionId, programId } = useLocalSearchParams<{
    protocolId: string;
    sessionId?: string;
    programId?: string;
  }>();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const { addHistory } = useSessionStore();

  const protocol = protocols.find((p) => p.id === protocolId);

  const handleSave = () => {
    addHistory({
      protocolId: protocolId ?? '',
      completedAt: new Date().toISOString(),
      rating: rating || undefined,
      feelingAfter: selectedMood || undefined,
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.topIcon}>
          <Text style={styles.sparkle}>✦</Text>
        </View>

        <Text style={styles.heading}>How was that for you?</Text>
        <Text style={styles.sub}>
          {protocol ? `You just completed "${protocol.title}"` : 'Session complete'}
        </Text>

        <Text style={styles.sectionLabel}>How do you feel now?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.moodCard, selectedMood === m.id && styles.moodCardActive]}
              onPress={() => setSelectedMood(m.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, selectedMood === m.id && styles.moodLabelActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Rate this session</Text>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={36}
                color={star <= rating ? colors.accent : colors.lavender}
              />
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood === 'need-more' && (
          <View style={styles.supportBanner}>
            <Ionicons name="heart-outline" size={18} color={colors.primary} />
            <Text style={styles.supportText}>
              That's okay. Head to Support Now for immediate help.
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/support')}>
              <Text style={styles.supportLink}>Open →</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, (!selectedMood && rating === 0) && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save & Return Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, alignItems: 'center' },
  topIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.sandLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  sparkle: { fontSize: 24, color: colors.accent },
  heading: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, textAlign: 'center', marginBottom: spacing.sm },
  sub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textSecondary, alignSelf: 'flex-start', marginBottom: spacing.md },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xl, width: '100%' },
  moodCard: {
    alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.sm,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white, minWidth: 80, flex: 1,
  },
  moodCardActive: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  moodEmoji: { fontSize: 24, marginBottom: 6 },
  moodLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  moodLabelActive: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  starsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  supportBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.azure, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg, width: '100%',
  },
  supportText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.coldViolet, flex: 1, lineHeight: 18 },
  supportLink: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.primary },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 14, alignItems: 'center', width: '100%', marginBottom: spacing.md, ...shadow.button },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
  skipBtn: { paddingVertical: spacing.sm },
  skipText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textMuted },
});
