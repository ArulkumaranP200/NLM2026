import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

const STATUS_COLORS = { success: colors.success, failed: colors.danger, pending: colors.warning };

export default function TransactionsTab({ transactions }) {
  return (
    <View style={styles.container}>
      {transactions.map((t) => (
        <View key={t.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.type}>{t.transaction_type.replace(/_/g, ' ')}</Text>
            <Text style={[styles.status, { color: STATUS_COLORS[t.status] || colors.textMuted }]}>{t.status}</Text>
          </View>
          <Text style={styles.desc}>{t.description}</Text>
          <Text style={styles.meta}>
            {t.user?.user_id || 'system'} · {t.ip_address || '—'} · {formatDate(t.created_at)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  type: { fontSize: 13, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  status: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  desc: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  meta: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});
