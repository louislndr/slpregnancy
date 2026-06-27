import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function CelebrateBirthScreen() {
  const setJourney = useOnboardingStore((s) => s.setJourney);

  const handleBeginPostpartum = () => {
    setJourney('postpartum');
    router.replace('/(tabs)/programs');
  };

  return (
    <LinearGradient colors={['#FFF8F4', '#FFE6D5', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.emojiWrap}>
            <Ionicons name="heart" size={36} color={colors.accent} />
          </View>

          <Text style={styles.heading}>Your baby has arrived.</Text>

          <Text style={styles.body}>
            This is one of the most profound moments of your life. Take a breath.{'\n\n'}
            Whatever you are feeling right now — joy, overwhelm, love, exhaustion, tenderness — it is all valid. You are allowed to feel everything at once.
          </Text>

          <View style={styles.affirmationCard}>
            <Text style={styles.affirmation}>
              "You grew a life. You brought them earthside.{'\n'}That is extraordinary."
            </Text>
          </View>

          <Text style={styles.body}>
            Your journey continues now. The postpartum chapter is its own kind of transformation — and we are here to support you through every step of it.
          </Text>

          <View style={styles.nextCard}>
            <Ionicons name="layers-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nextTitle}>Returning To Myself</Text>
              <Text style={styles.nextSub}>A postpartum journey back to you — body, mind and identity</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleBeginPostpartum} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Begin My Postpartum Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.secondaryBtnText}>Go to Home</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, alignItems: 'center' },
  emojiWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, ...shadow.card },
  heading: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, textAlign: 'center', lineHeight: 36, marginBottom: spacing.lg },
  body: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: spacing.lg },
  affirmationCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg, width: '100%', ...shadow.card },
  affirmation: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 17, color: colors.coldViolet, textAlign: 'center', lineHeight: 28 },
  nextCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.xl, width: '100%', ...shadow.card,
    borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  nextTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet, marginBottom: 2 },
  nextSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 16, alignItems: 'center', width: '100%', marginBottom: spacing.md, ...shadow.button },
  primaryBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  secondaryBtn: { paddingVertical: spacing.sm },
  secondaryBtnText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textMuted },
});
