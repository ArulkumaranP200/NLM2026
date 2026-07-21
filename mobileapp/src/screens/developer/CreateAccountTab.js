import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { colors, spacing } from '../../constants/theme';
import { toast, apiErrorMessage } from '../../utils/toast';
import api from '../../api/client';

const ROLE_OPTIONS = [{ value: 'admin', label: 'Admin' }, { value: 'developer', label: 'Developer' }];

const INITIAL = { full_name: '', email: '', password: '', role: 'admin' };

export default function CreateAccountTab({ onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [creating, setCreating] = useState(false);

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleCreate = async () => {
    if (!form.full_name.trim() || !form.email.trim() || form.password.length < 8) {
      toast.error('Please fill name, email, and a password with at least 8 characters.');
      return;
    }
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('confirm_password', form.password);
      formData.append('phone', '0000000000');
      formData.append('date_of_birth', '1990-01-01');
      formData.append('gender', 'male');
      formData.append('religion', 'other');
      formData.append('mother_tongue', 'English');
      formData.append('marital_status', 'single');
      formData.append('city', 'Admin City');
      formData.append('state', 'Admin State');
      formData.append('country', 'India');
      formData.append('education', 'bachelors');
      formData.append('occupation', form.role === 'admin' ? 'Administrator' : 'Developer');

      const { data } = await api.post('/auth/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await api.patch(`/auth/users/${data.user.id}/`, { role: form.role, is_staff: true });

      toast.success(`${form.role === 'admin' ? 'Admin' : 'Developer'} account created for ${form.full_name}`);
      setForm(INITIAL);
      onCreated();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not create account.'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Admin / Developer Account</Text>
      <FormField label="Full Name" value={form.full_name} onChangeText={(v) => onChange('full_name', v)} required />
      <FormField label="Email" value={form.email} onChangeText={(v) => onChange('email', v)} keyboardType="email-address" required />
      <FormField label="Password" value={form.password} onChangeText={(v) => onChange('password', v)} secureTextEntry placeholder="Min 8 characters" required />
      <PickerField label="Role" value={form.role} onValueChange={(v) => onChange('role', v)} options={ROLE_OPTIONS} required />

      <Pressable style={[styles.createBtn, creating && styles.createBtnDisabled]} onPress={handleCreate} disabled={creating}>
        <Text style={styles.createBtnText}>{creating ? 'Creating...' : 'Create Account'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  heading: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  createBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: spacing.sm },
  createBtnDisabled: { opacity: 0.6 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
