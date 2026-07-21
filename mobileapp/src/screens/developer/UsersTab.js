import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import RoleBadge from '../../components/RoleBadge';
import { confirmAction } from '../../components/ConfirmDialog';
import { colors, spacing } from '../../constants/theme';
import { toast, apiErrorMessage } from '../../utils/toast';
import api from '../../api/client';

export default function UsersTab({ users, onChanged }) {
  const forceDelete = (user) => confirmAction({
    title: 'Force Delete User',
    message: `Permanently delete ${user.full_name}'s account?`,
    confirmLabel: 'Delete',
    onConfirm: async () => {
      try {
        await api.delete(`/auth/users/${user.id}/`);
        toast.success('User deleted');
        onChanged();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Could not delete user.'));
      }
    },
  });

  return (
    <View style={styles.container}>
      {users.map((u) => (
        <View key={u.id} style={[styles.row, (u.role === 'developer') && styles.devRow]}>
          <View style={styles.rowMain}>
            <Text style={styles.rowName}>{u.full_name}</Text>
            <Text style={styles.rowSub}>{u.email} · {u.user_id}</Text>
            <View style={styles.badges}>
              <RoleBadge role={u.role} />
              <Text style={[styles.statusText, { color: u.is_active ? colors.success : colors.danger }]}>
                {u.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <Pressable style={styles.deleteBtn} onPress={() => forceDelete(u)}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  devRow: { borderColor: '#8e44ad', backgroundColor: '#faf5fc' },
  rowMain: { flex: 1, gap: 2 },
  rowName: { fontSize: 14, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: 12, color: colors.textMuted },
  badges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.danger },
  deleteBtnText: { fontSize: 11, color: colors.danger, fontWeight: '700' },
});
