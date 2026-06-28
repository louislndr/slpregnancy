import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import AppHeader from '@/components/AppHeader';

const PRINCIPLES = [
  { title: 'Body Relaxation', desc: 'Releasing physical tension through guided awareness, breathing and gentle movement.' },
  { title: 'Positive Visualization', desc: 'Using the imagination to rehearse calm, confident outcomes before they happen.' },
  { title: 'Breathing', desc: 'Controlled breathing rhythms that activate the parasympathetic nervous system.' },
  { title: 'Positive Affirmations', desc: 'Simple phrases repeated during a relaxed state to anchor calm and confidence.' },
];

export default function SophrologyScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.heading}>What is Sophrology?</Text>
        <Text style={styles.sub}>A science-based mind-body practice developed in the 1960s</Text>

        <View style={styles.introCard}>
          <Text style={styles.introText}>
            Sophrology combines breathing techniques, body awareness, relaxation and visualization to help you manage stress, anxiety and pain — and build inner resources for whatever life brings.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>How it works</Text>
        <Text style={styles.body}>
          During a session, you enter a state between waking and sleeping — called the "sophroliminal level." In this relaxed but aware state, your mind is highly receptive to positive suggestion and visualization.
        </Text>
        <Text style={styles.body}>
          The practice is accessible to everyone. You don't need any experience, flexibility, or prior knowledge. You simply follow the voice guidance.
        </Text>

        <Text style={styles.sectionTitle}>The four pillars</Text>
        {PRINCIPLES.map((p) => (
          <View key={p.title} style={styles.pillarCard}>
            <Text style={styles.pillarTitle}>{p.title}</Text>
            <Text style={styles.pillarDesc}>{p.desc}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Sophrology and pregnancy</Text>
        <Text style={styles.body}>
          Clinical studies have shown that regular sophrology practice during pregnancy and fertility treatment can reduce anxiety, improve sleep quality, and help women feel more prepared and empowered for birth.
        </Text>
        <Text style={styles.body}>
          Our sessions are designed by certified sophrologists and adapted for each stage of your journey — from trying to conceive through to the postpartum period.
        </Text>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  heading: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, marginBottom: spacing.sm },
  sub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg, lineHeight: 22 },
  introCard: { backgroundColor: colors.azure, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  introText: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet, lineHeight: 24 },
  sectionTitle: { fontFamily: 'Raleway_700Bold', fontSize: 18, color: colors.coldViolet, marginBottom: spacing.sm, marginTop: spacing.md },
  body: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  pillarCard: { backgroundColor: colors.sandLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  pillarTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet, marginBottom: 4 },
  pillarDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});
