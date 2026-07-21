import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/client';
import AvatarImage from '../../components/AvatarImage';
import StatCard from '../../components/StatCard';
import RoleBadge from '../../components/RoleBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { confirmAction } from '../../components/ConfirmDialog';
import { colors, spacing } from '../../constants/theme';
import { toast, apiErrorMessage } from '../../utils/toast';

const ROLES = ['user', 'admin', 'developer'];

export default function AdminPanelScreen() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, profilesRes] = await Promise.all([
        api.get('/auth/users/'),
        api.get('/profiles/admin/'),
      ]);
      setUsers(usersRes.data);
      setProfiles(profilesRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const changeRole = async (user, role) => {
    if (role === user.role) return;
    try {
      await api.patch(`/auth/users/${user.id}/`, { role });
      toast.success(`${user.full_name}'s role updated to ${role}`);
      loadData();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update role.'));
    }
  };

  const toggleActive = async (user) => {
    try {
      await api.patch(`/auth/users/${user.id}/`, { is_active: !user.is_active });
      toast.success(`${user.full_name} ${user.is_active ? 'deactivated' : 'activated'}`);
      loadData();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update user.'));
    }
  };

  const deleteUser = (user) => confirmAction({
    title: 'Delete User',
    message: `Delete ${user.full_name}'s account? This cannot be undone.`,
    confirmLabel: 'Delete',
    onConfirm: async () => {
      try {
        await api.delete(`/auth/users/${user.id}/`);
        toast.success('User deleted');
        loadData();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Could not delete user.'));
      }
    },
  });

  const deleteProfile = (profile) => confirmAction({
    title: 'Delete Profile',
    message: `Delete this profile? This cannot be undone.`,
    confirmLabel: 'Delete',
    onConfirm: async () => {
      try {
        await api.delete(`/profiles/admin/${profile.id}/`);
        toast.success('Profile deleted');
        loadData();
      } catch (err) {
        toast.error(apiErrorMessage(err, 'Could not delete profile.'));
      }
    },
  });

  if (loading) return <LoadingSpinner />;

  const activeUsers = users.filter((u) => u.is_active).length;

  const Header = (
    <View>
      <View style={styles.statsRow}>
        <StatCard value={users.length} label="Total Users" />
        <StatCard value={profiles.length} label="Total Profiles" />
        <StatCard value={activeUsers} label="Active Users" />
      </View>
      <View style={styles.tabRow}>
        <Pressable style={[styles.tabBtn, tab === 'users' && styles.tabBtnActive]} onPress={() => setTab('users')}>
          <Text style={[styles.tabBtnText, tab === 'users' && styles.tabBtnTextActive]}>Users</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, tab === 'profiles' && styles.tabBtnActive]} onPress={() => setTab('profiles')}>
          <Text style={[styles.tabBtnText, tab === 'profiles' && styles.tabBtnTextActive]}>Profiles</Text>
        </Pressable>
      </View>
    </View>
  );

  if (tab === 'users') {
    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        data={users}
        keyExtractor={(u) => String(u.id)}
        ListHeaderComponent={Header}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.rowName}>{item.full_name}</Text>
              <Text style={styles.rowSub}>{item.email} · {item.user_id}</Text>
              <View style={styles.rowBadges}>
                <RoleBadge role={item.role} />
                <Text style={[styles.statusText, { color: item.is_active ? colors.success : colors.danger }]}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <View style={styles.rolePickerWrap}>
                <Picker selectedValue={item.role} onValueChange={(v) => changeRole(item, v)} style={styles.rolePicker}>
                  {ROLES.map((r) => <Picker.Item key={r} label={r} value={r} />)}
                </Picker>
              </View>
              <Pressable style={styles.actionBtn} onPress={() => toggleActive(item)}>
                <Text style={styles.actionBtnText}>{item.is_active ? 'Deactivate' : 'Activate'}</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deleteUser(item)}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={profiles}
      keyExtractor={(p) => String(p.id)}
      ListHeaderComponent={Header}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <AvatarImage uri={item.photo_url} name={item.user?.full_name} size={44} />
          <View style={styles.rowMain}>
            <Text style={styles.rowName}>{item.user?.full_name}</Text>
            <Text style={styles.rowSub}>{[item.gender, item.religion, item.city].filter(Boolean).join(' · ')}</Text>
          </View>
          <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deleteProfile(item)}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.md, gap: spacing.sm },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabBtnText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  tabBtnTextActive: { color: '#fff' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.sm, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  rowMain: { flex: 1, gap: 2 },
  rowName: { fontSize: 14, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: 12, color: colors.textMuted },
  rowBadges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  rowActions: { alignItems: 'flex-end', gap: 6 },
  rolePickerWrap: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, width: 130 },
  rolePicker: { height: 36, color: colors.text },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  actionBtnText: { fontSize: 11, color: colors.text, fontWeight: '600' },
  deleteBtn: { borderColor: colors.danger },
  deleteBtnText: { fontSize: 11, color: colors.danger, fontWeight: '700' },
});
