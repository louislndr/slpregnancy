import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useSessionStore } from '@/store/sessionStore';
import { useDataStore } from '@/store/dataStore';

const MOODS = [
  { id: 'much-calmer', emoji: '🌸', label: 'Much calmer' },
  { id: 'lighter',     emoji: '☁️', label: 'Lighter'      },
  { id: 'same',        emoji: '🌿', label: 'About the same'},
  { id: 'reflective',  emoji: '🌙', label: 'Reflective'   },
  { id: 'need-more',   emoji: '💙', label: 'Need more'    },
];

const EMOTIONS = [
  'Calmer', 'Hopeful', 'Grounded', 'Relieved',
  'Moved', 'Lighter', 'Stronger', 'Emotional',
  'Grateful', 'At peace',
];

export default function SessionFeedbackScreen() {
  const { protocolId, sessionId, programId } = useLocalSearchParams<{
    protocolId: string;
    sessionId?: string;
    programId?: string;
  }>();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState<number>(0);
  const { addHistory } = useSessionStore();
  const protocols = useDataStore((s) => s.protocols);

  const protocol = protocols.find((p) => p.id === protocolId);

  const handleSave = () => {
    addHistory({
      protocolId: protocolId ?? '',
      completedAt: new Date().toISOString(),
      rating: rating || undefined,
      feelingAfter: selectedMood || undefined,
      emotion: selectedEmotion || undefined,
      note: note.trim() || undefined,
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

        <Text style={styles.sectionLabel}>What did you feel?</Text>
        <View style={styles.emotionWrap}>
          {EMOTIONS.map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.emotionChip, selectedEmotion === e && styles.emotionChipActive]}
              onPress={() => setSelectedEmotion(selectedEmotion === e ? null : e)}
              activeOpacity={0.7}
            >
              <Text style={[styles.emotionText, selectedEmotion === e && styles.emotionTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>A note for yourself <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.noteInput}
          placeholder="What came up for you during this session?"
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={(t) => setNote(t.slice(0, 200))}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <Text style={styles.noteCount}>{note.length}/200</Text>

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
  emotionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg, width: '100%' },
  emotionChip: {
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: 9999, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white,
  },
  emotionChipActive: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  emotionText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary },
  emotionTextActive: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  noteInput: {
    width: '100%', borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textPrimary,
    minHeight: 80, backgroundColor: colors.white, marginBottom: 4,
  },
  noteCount: { fontFamily: 'Montserrat_400Regular', fontSize: 11, color: colors.textMuted, alignSelf: 'flex-end', marginBottom: spacing.lg },
  optional: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted },
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
