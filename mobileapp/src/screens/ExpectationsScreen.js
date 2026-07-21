import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, spacing } from '../constants/theme';
import { toast } from '../utils/toast';

const INITIAL = {
  min_age: '', max_age: '', min_height: '', max_height: '',
  religion: '', caste: '', marital_status: '',
  education: '', occupation: '', location: '',
  description: '',
};

export default function ExpectationsScreen() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      api.get('/profiles/expectations/').then(({ data }) => {
        if (!active) return;
        const next = { ...INITIAL };
        Object.keys(INITIAL).forEach((k) => { next[k] = data[k] != null ? String(data[k]) : ''; });
        setForm(next);
      }).finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/expectations/', form);
      toast.success('Expectations saved successfully');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) Object.values(errs).flat().forEach((msg) => toast.error(String(msg)));
      else toast.error('Could not save your expectations. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Age & Physical</Text>
      <View style={styles.row}>
        <View style={styles.col}><FormField label="Min Age" value={form.min_age} onChangeText={(v) => onChange('min_age', v)} keyboardType="number-pad" /></View>
        <View style={styles.col}><FormField label="Max Age" value={form.max_age} onChangeText={(v) => onChange('max_age', v)} keyboardType="number-pad" /></View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}><FormField label="Min Height (cm)" value={form.min_height} onChangeText={(v) => onChange('min_height', v)} keyboardType="number-pad" /></View>
        <View style={styles.col}><FormField label="Max Height (cm)" value={form.max_height} onChangeText={(v) => onChange('max_height', v)} keyboardType="number-pad" /></View>
      </View>

      <Text style={styles.sectionTitle}>Background</Text>
      <FormField label="Religion" value={form.religion} onChangeText={(v) => onChange('religion', v)} placeholder="e.g. Hindu, or Any" />
      <FormField label="Caste" value={form.caste} onChangeText={(v) => onChange('caste', v)} placeholder="e.g. Any" />
      <FormField label="Marital Status" value={form.marital_status} onChangeText={(v) => onChange('marital_status', v)} placeholder="e.g. Single" />

      <Text style={styles.sectionTitle}>Career & Location</Text>
      <FormField label="Education" value={form.education} onChangeText={(v) => onChange('education', v)} />
      <FormField label="Occupation" value={form.occupation} onChangeText={(v) => onChange('occupation', v)} />
      <FormField label="Location" value={form.location} onChangeText={(v) => onChange('location', v)} placeholder="City or state" />

      <Text style={styles.sectionTitle}>Additional Notes</Text>
      <FormField value={form.description} onChangeText={(v) => onChange('description', v)} multiline />

      <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Expectations'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  col: { flex: 1 },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: spacing.lg },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
