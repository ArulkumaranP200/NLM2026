import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

const FEATURES = [
  { icon: '✅', title: 'Verified Profiles', desc: 'Every profile is reviewed for authenticity.' },
  { icon: '🎯', title: 'Smart Matching', desc: 'Find matches based on your preferences.' },
  { icon: '📋', title: 'Rich Profiles', desc: 'Detailed profiles with family and horoscope info.' },
  { icon: '🤝', title: 'All Communities', desc: 'Welcoming members from every background.' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heroEmoji}>💑</Text>
      <Text style={styles.heroTitle}>Find Your Life Partner</Text>
      <Text style={styles.heroSubtitle}>
        Join thousands of families finding meaningful matches on UTM Matrimony.
      </Text>

      <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.primaryBtnText}>Get Started Free</Text>
      </Pressable>
      <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryBtnText}>Sign In</Text>
      </Pressable>

      <View style={styles.featuresGrid}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to begin your journey?</Text>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.primaryBtnText}>Create Free Profile</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: 'center' },
  heroEmoji: { fontSize: 48, marginBottom: spacing.sm },
  heroTitle: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  primaryBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: spacing.xl, borderRadius: 10, marginBottom: spacing.sm, width: '100%', alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { paddingVertical: 12, paddingHorizontal: spacing.xl, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, width: '100%', alignItems: 'center' },
  secondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  featureCard: { width: '46%', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  featureIcon: { fontSize: 26, marginBottom: spacing.xs },
  featureTitle: { fontSize: 13, fontWeight: '700', color: colors.text, textAlign: 'center' },
  featureDesc: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  ctaSection: { marginTop: spacing.xl, alignItems: 'center', width: '100%' },
  ctaTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
