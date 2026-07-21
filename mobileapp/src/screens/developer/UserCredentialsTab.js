import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme';

export default function UserCredentialsTab({ credentials }) {
  return (
    <View style={styles.container}>
      {credentials.map((c) => (
        <View key={c.id} style={styles.row}>
          <Text style={styles.name}>{c.user?.full_name} <Text style={styles.userId}>({c.user?.user_id})</Text></Text>
          <Text style={styles.email}>{c.user?.email}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Logins: {c.login_count}</Text>
            <Text style={styles.meta}>Last IP: {c.last_login_ip || '—'}</Text>
            <Text style={[styles.meta, { color: c.is_email_verified ? colors.success : colors.warning }]}>
              {c.is_email_verified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  userId: { fontWeight: '400', color: colors.textMuted },
  email: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: 6 },
  meta: { fontSize: 11, color: colors.textMuted },
});
