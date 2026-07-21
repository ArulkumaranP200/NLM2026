import { View, Text, StyleSheet } from 'react-native';
import StatCard from '../../components/StatCard';
import { colors, spacing } from '../../constants/theme';

export default function OverviewTab({ users, profiles, transactions }) {
  const admins = users.filter((u) => u.role === 'admin').length;
  const developers = users.filter((u) => u.role === 'developer').length;
  const activeUsers = users.filter((u) => u.is_active).length;

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <StatCard value={users.length} label="Total Users" />
        <StatCard value={profiles.length} label="Total Profiles" />
        <StatCard value={admins} label="Admins" />
        <StatCard value={developers} label="Developers" />
        <StatCard value={activeUsers} label="Active Users" />
        <StatCard value={transactions.length} label="Total Transactions" />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>System Info</Text>
        <InfoRow label="Backend" value="Django 5.2 + DRF" />
        <InfoRow label="Frontend" value="React 18" />
        <InfoRow label="Database" value="PostgreSQL 18" />
        <InfoRow label="Auth" value="JWT / SimpleJWT" />
        <InfoRow label="User ID Format" value="UTM + 4 digits" />
      </View>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  infoCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  infoTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.background },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 12, color: colors.text, fontWeight: '600' },
});
