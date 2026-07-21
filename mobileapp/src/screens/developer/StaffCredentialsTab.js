import { View, Text, StyleSheet } from 'react-native';
import RoleBadge from '../../components/RoleBadge';
import { colors, spacing } from '../../constants/theme';

export default function StaffCredentialsTab({ credentials }) {
  return (
    <View style={styles.container}>
      {credentials.map((c) => (
        <View key={c.id} style={styles.row}>
          <View style={styles.header}>
            <Text style={styles.name}>{c.user?.full_name}</Text>
            <RoleBadge role={c.user?.role} />
          </View>
          <Text style={styles.meta}>Employee ID: {c.employee_id}</Text>
          <Text style={styles.meta}>Department: {c.department} · Access Level: {c.access_level}</Text>
          <Text style={styles.meta}>Logins: {c.login_count} · Last IP: {c.last_login_ip || '—'}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  meta: { fontSize: 11, color: colors.textMuted },
});
