import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import AvatarImage from '../components/AvatarImage';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentUnlockCard from './PaymentUnlockCard';
import { colors, spacing } from '../constants/theme';
import { toast } from '../utils/toast';

function hasFamilyInfo(p) {
  return !!(p.father_name || p.father_occupation || p.mother_name || p.mother_occupation
    || p.number_of_brothers || p.number_of_sisters || p.sibling_details);
}

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ProfileDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      api.get(`/profiles/${id}/`)
        .then(({ data }) => active && setProfile(data))
        .catch(() => {
          toast.error('Could not load this profile.');
          navigation.goBack();
        })
        .finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [id])
  );

  if (loading || !profile) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AvatarImage uri={profile.photo_url} name={profile.user?.full_name} size={96} />
        <Text style={styles.name}>{profile.user?.full_name}</Text>
        <View style={styles.tags}>
          {profile.age ? <Text style={styles.tag}>{profile.age} yrs</Text> : null}
          {profile.gender ? <Text style={styles.tag}>{profile.gender}</Text> : null}
          {profile.marital_status ? <Text style={styles.tag}>{profile.marital_status}</Text> : null}
        </View>
      </View>

      {profile.about_me ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutText}>{profile.about_me}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <DetailRow label="Religion" value={profile.religion} />
        <DetailRow label="Caste" value={profile.caste} />
        <DetailRow label="Mother Tongue" value={profile.mother_tongue} />
        <DetailRow label="Height" value={profile.height ? `${profile.height} cm` : null} />
        <DetailRow label="Weight" value={profile.weight ? `${profile.weight} kg` : null} />
        <DetailRow label="City" value={[profile.city, profile.state].filter(Boolean).join(', ')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Education & Career</Text>
        <DetailRow label="Education" value={profile.education} />
        <DetailRow label="Occupation" value={profile.occupation} />
        <DetailRow label="Annual Income" value={profile.annual_income} />
      </View>

      {(profile.zodiac_sign || profile.nakshatra || profile.birth_place) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horoscope</Text>
          <DetailRow label="Zodiac Sign" value={profile.zodiac_sign} />
          <DetailRow label="Nakshatra" value={profile.nakshatra} />
          <DetailRow label="Birth Place" value={profile.birth_place} />
        </View>
      )}

      {hasFamilyInfo(profile) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Family Details</Text>
          <DetailRow label="Father's Name" value={profile.father_name} />
          <DetailRow label="Father's Occupation" value={profile.father_occupation} />
          <DetailRow label="Mother's Name" value={profile.mother_name} />
          <DetailRow label="Mother's Occupation" value={profile.mother_occupation} />
          <DetailRow label="Brothers" value={profile.number_of_brothers} />
          <DetailRow label="Sisters" value={profile.number_of_sisters} />
        </View>
      )}

      {profile.is_unlocked ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact & Address</Text>
          <DetailRow label="Phone" value={profile.phone} />
          <DetailRow label="Address" value={profile.present_address} />
          <DetailRow label="Sibling Details" value={profile.sibling_details} />
        </View>
      ) : (
        <PaymentUnlockCard profileId={id} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  header: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  tags: { flexDirection: 'row', gap: 6 },
  tag: {
    fontSize: 11, color: colors.primaryDark, backgroundColor: '#fbeceb',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden',
  },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  aboutText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.background },
  detailLabel: { fontSize: 13, color: colors.textMuted },
  detailValue: { fontSize: 13, color: colors.text, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});
