import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import { colors, spacing } from '../../constants/theme';
import OverviewTab from './OverviewTab';
import UsersTab from './UsersTab';
import TransactionsTab from './TransactionsTab';
import UserCredentialsTab from './UserCredentialsTab';
import StaffCredentialsTab from './StaffCredentialsTab';
import CreateAccountTab from './CreateAccountTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'userCredentials', label: 'User Credentials' },
  { key: 'staffCredentials', label: 'Staff Credentials' },
  { key: 'createAccount', label: 'Create Account' },
];

export default function DeveloperPanelScreen() {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userCreds, setUserCreds] = useState([]);
  const [staffCreds, setStaffCreds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, profilesRes, txRes, userCredsRes, staffCredsRes] = await Promise.all([
        api.get('/auth/users/'),
        api.get('/profiles/admin/'),
        api.get('/auth/transactions/'),
        api.get('/auth/credentials/users/'),
        api.get('/auth/credentials/staff/'),
      ]);
      setUsers(usersRes.data);
      setProfiles(profilesRes.data);
      setTransactions(txRes.data);
      setUserCreds(userCredsRes.data);
      setStaffCreds(staffCredsRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabBtnText, tab === t.key && styles.tabBtnTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {tab === 'overview' && <OverviewTab users={users} profiles={profiles} transactions={transactions} />}
        {tab === 'users' && <UsersTab users={users} onChanged={loadData} />}
        {tab === 'transactions' && <TransactionsTab transactions={transactions} />}
        {tab === 'userCredentials' && <UserCredentialsTab credentials={userCreds} />}
        {tab === 'staffCredentials' && <StaffCredentialsTab credentials={staffCreds} />}
        {tab === 'createAccount' && <CreateAccountTab onCreated={loadData} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBarContent: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, gap: spacing.sm },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabBtnText: { fontSize: 12, fontWeight: '700', color: colors.text },
  tabBtnTextActive: { color: '#fff' },
  content: { flex: 1 },
  contentInner: { padding: spacing.md },
});
