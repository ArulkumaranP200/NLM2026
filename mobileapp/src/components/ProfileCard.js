import { View, Text, Pressable, StyleSheet } from 'react-native';
import AvatarImage from './AvatarImage';
import { colors, spacing } from '../constants/theme';
import { formatAge } from '../utils/formatters';

export default function ProfileCard({ profile, onPress, compact, viewedAt }) {
  const name = profile.user?.full_name;

  if (compact) {
    return (
      <Pressable style={styles.compactCard} onPress={onPress}>
        <AvatarImage uri={profile.photo_url} name={name} size={48} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{name}</Text>
          <Text style={styles.compactMeta} numberOfLines={1}>
            {formatAge(profile.age)}{profile.city ? ` · ${profile.city}` : ''}
          </Text>
          {viewedAt ? <Text style={styles.viewedAt}>Viewed {new Date(viewedAt).toLocaleDateString()}</Text> : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.photoWrap}>
        <AvatarImage uri={profile.photo_url} name={name} size={72} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.tags}>
        {profile.age ? <Text style={styles.tag}>{profile.age} yrs</Text> : null}
        {profile.religion ? <Text style={styles.tag}>{profile.religion}</Text> : null}
        {profile.education ? <Text style={styles.tag}>{profile.education}</Text> : null}
      </View>
      <Text style={styles.location} numberOfLines={1}>
        📍 {profile.city || 'Location not set'}{profile.state ? `, ${profile.state}` : ''}
      </Text>
      {profile.occupation ? <Text style={styles.occupation} numberOfLines={1}>💼 {profile.occupation}</Text> : null}
      {profile.about_me ? (
        <Text style={styles.about} numberOfLines={2}>{profile.about_me}</Text>
      ) : null}
      <Text style={styles.viewLink}>View Profile →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  photoWrap: { marginBottom: spacing.sm },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 6 },
  tag: {
    fontSize: 11, color: colors.primaryDark, backgroundColor: '#fbeceb',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden',
  },
  location: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  occupation: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  about: { fontSize: 12, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  viewLink: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 10 },
  compactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  compactInfo: { flex: 1 },
  compactName: { fontSize: 14, fontWeight: '700', color: colors.text },
  compactMeta: { fontSize: 12, color: colors.textMuted },
  viewedAt: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});
