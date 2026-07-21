import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { useAuth } from '../auth/AuthContext';
import AvatarImage from '../components/AvatarImage';
import StatCard from '../components/StatCard';
import RoleBadge from '../components/RoleBadge';
import ProfileCard from '../components/ProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, spacing } from '../constants/theme';
import { computeProfileCompletion } from '../utils/profileCompletion';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      Promise.all([
        api.get('/profiles/me/'),
        api.get('/profiles/viewed/'),
      ]).then(([profileRes, viewedRes]) => {
        if (!active) return;
        setProfile(profileRes.data);
        setViewedProfiles(viewedRes.data.slice(0, 6));
        setTotalViews(viewedRes.data.length);
      }).finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  if (loading) return <LoadingSpinner />;

  const completion = computeProfileCompletion(profile);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AvatarImage uri={profile?.photo_url} name={user?.full_name} size={64} />
        <View style={styles.headerText}>
          <Text style={styles.welcome}>Welcome, {user?.full_name}!</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <RoleBadge role={user?.role} />
          <Text style={styles.userId}>ID: {user?.user_id}</Text>
        </View>
      </View>

      <Pressable style={styles.editBtn} onPress={() => navigation.navigate('My Profile')}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </Pressable>

      <View style={styles.statsRow}>
        <StatCard icon="👁️" value={totalViews} label="Profiles Viewed" />
        <StatCard icon="📊" value={`${completion}%`} label="Profile Complete" />
        <StatCard icon="💍" value={profile?.expectation ? 'Set' : 'Not Set'} label="Expectations" />
      </View>

      {completion < 100 && (
        <View style={styles.completionBanner}>
          <View style={styles.completionBarWrap}>
            <View style={[styles.completionBar, { width: `${completion}%` }]} />
          </View>
          <Text style={styles.completionText}>
            Your profile is {completion}% complete.{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('My Profile')}>Complete it now</Text> to get better matches!
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Details</Text>
        <DetailRow label="Name" value={user?.full_name} />
        <DetailRow label="Email" value={user?.email} />
        <DetailRow label="Gender" value={profile?.gender} />
        <DetailRow label="Age" value={profile?.age ? `${profile.age} yrs` : null} />
        <DetailRow label="Religion" value={profile?.religion} />
        <DetailRow label="Education" value={profile?.education} />
        <DetailRow label="Occupation" value={profile?.occupation} />
        <DetailRow label="City" value={profile?.city} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Partner Expectations</Text>
        {profile?.expectation ? (
          <>
            <DetailRow label="Age Range" value={`${profile.expectation.min_age}–${profile.expectation.max_age} yrs`} />
            <DetailRow label="Religion" value={profile.expectation.religion} />
            <DetailRow label="Education" value={profile.expectation.education} />
            <DetailRow label="Location" value={profile.expectation.location} />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expectations set yet</Text>
            <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Expectations')}>
              <Text style={styles.secondaryBtnText}>Set Expectations</Text>
            </Pressable>
          </View>
        )}
      </View>

      {viewedProfiles.length > 0 && (
        <View style={styles.viewedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Recently Viewed Profiles</Text>
            <Pressable onPress={() => navigation.navigate('Browse')}>
              <Text style={styles.link}>Browse All</Text>
            </Pressable>
          </View>
          <View style={styles.viewedGrid}>
            {viewedProfiles.map(({ viewed_profile, viewed_at }) => (
              <ProfileCard
                key={viewed_profile.id}
                profile={viewed_profile}
                compact
                viewedAt={viewed_at}
                onPress={() => navigation.navigate('ProfileDetail', { id: viewed_profile.id })}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  headerText: { flex: 1, gap: 2 },
  welcome: { fontSize: 18, fontWeight: '700', color: colors.text },
  email: { fontSize: 13, color: colors.textMuted },
  userId: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 2 },
  editBtn: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  editBtnText: { color: '#fff', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  completionBanner: { backgroundColor: '#fff3e0', borderRadius: 12, padding: spacing.md },
  completionBarWrap: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.sm },
  completionBar: { height: 6, backgroundColor: colors.primary },
  completionText: { fontSize: 13, color: colors.text },
  link: { color: colors.primary, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.background },
  detailLabel: { fontSize: 13, color: colors.textMuted },
  detailValue: { fontSize: 13, color: colors.text, fontWeight: '600' },
  emptyState: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  secondaryBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: spacing.md },
  secondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  viewedSection: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewedGrid: { gap: spacing.sm },
});
