import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { fetchCastes } from '../api/castes';
import FormField from '../components/FormField';
import PickerField from '../components/PickerField';
import SearchablePickerModal from '../components/SearchablePickerModal';
import DateField from '../components/DateField';
import ImagePickerAvatar from '../components/ImagePickerAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, spacing } from '../constants/theme';
import { toast } from '../utils/toast';
import { appendPhotoAsset } from '../utils/photoFormData';
import { GENDERS, MARITAL_STATUSES, EDUCATION_LEVELS, RELIGIONS, religionLabel } from '../data/staticOptions';
import { INDIAN_LANGUAGES } from '../data/languages';
import { INDIA_STATES, INDIA_STATES_CITIES } from '../data/indiaCities';

const INITIAL = {
  date_of_birth: '', gender: '', religion: '', caste: '', mother_tongue: '',
  marital_status: '', height: '', weight: '', education: '', occupation: '',
  annual_income: '', city: '', state: '', country: 'India', about_me: '', phone: '',
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  number_of_brothers: '', number_of_sisters: '', sibling_details: '',
};

const RELIGION_OPTIONS = RELIGIONS.map((r) => ({ value: r, label: religionLabel(r) }));

export default function EditProfileScreen() {
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [casteOptions, setCasteOptions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      api.get('/profiles/me/').then(({ data }) => {
        if (!active) return;
        const next = { ...INITIAL };
        Object.keys(INITIAL).forEach((k) => { next[k] = data[k] ? String(data[k]) : (k === 'country' ? 'India' : ''); });
        setForm(next);
        setPhotoPreview(data.photo_url || null);
      }).finally(() => active && setLoading(false));
      return () => { active = false; };
    }, [])
  );

  useEffect(() => {
    if (!form.religion) { setCasteOptions([]); return; }
    let active = true;
    fetchCastes(form.religion).then((data) => { if (active) setCasteOptions(data); });
    return () => { active = false; };
  }, [form.religion]);

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleStateChange = (state) => {
    onChange('state', state);
    onChange('city', '');
  };

  const handleReligionChange = (religion) => {
    onChange('religion', religion);
    onChange('caste', '');
  };

  const handlePhotoChange = (asset) => {
    setPhoto(asset);
    setPhotoPreview(asset?.uri || null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      appendPhotoAsset(formData, photo);
      await api.put('/profiles/me/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated successfully');
      setPhoto(null);
    } catch (err) {
      const errs = err.response?.data;
      if (errs) Object.values(errs).flat().forEach((msg) => toast.error(String(msg)));
      else toast.error('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const cityOptions = form.state ? INDIA_STATES_CITIES[form.state] || [] : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ImagePickerAvatar uri={photoPreview} onChange={handlePhotoChange} />

      <Text style={styles.sectionTitle}>Personal Information</Text>
      <DateField label="Date of Birth" value={form.date_of_birth} onChange={(v) => onChange('date_of_birth', v)} maximumDate={new Date()} />
      <PickerField label="Gender" value={form.gender} onValueChange={(v) => onChange('gender', v)} options={GENDERS} />
      <PickerField label="Religion" value={form.religion} onValueChange={handleReligionChange} options={RELIGION_OPTIONS} />
      <PickerField
        label="Caste" value={form.caste} onValueChange={(v) => onChange('caste', v)}
        options={casteOptions} placeholder={form.religion ? 'Select Caste' : 'Select religion first'}
        enabled={!!form.religion}
      />
      <PickerField label="Mother Tongue" value={form.mother_tongue} onValueChange={(v) => onChange('mother_tongue', v)} options={INDIAN_LANGUAGES} />
      <PickerField label="Marital Status" value={form.marital_status} onValueChange={(v) => onChange('marital_status', v)} options={MARITAL_STATUSES} />
      <FormField label="Height (cm)" value={form.height} onChangeText={(v) => onChange('height', v)} keyboardType="number-pad" />
      <FormField label="Weight (kg)" value={form.weight} onChangeText={(v) => onChange('weight', v)} keyboardType="number-pad" />
      <FormField label="Phone" value={form.phone} onChangeText={(v) => onChange('phone', v.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" maxLength={10} />

      <Text style={styles.sectionTitle}>Education & Career</Text>
      <PickerField label="Education" value={form.education} onValueChange={(v) => onChange('education', v)} options={EDUCATION_LEVELS} />
      <FormField label="Occupation" value={form.occupation} onChangeText={(v) => onChange('occupation', v)} />
      <FormField label="Annual Income" value={form.annual_income} onChangeText={(v) => onChange('annual_income', v)} />

      <Text style={styles.sectionTitle}>Family Details</Text>
      <FormField label="Father's Name" value={form.father_name} onChangeText={(v) => onChange('father_name', v)} />
      <FormField label="Father's Occupation" value={form.father_occupation} onChangeText={(v) => onChange('father_occupation', v)} />
      <FormField label="Mother's Name" value={form.mother_name} onChangeText={(v) => onChange('mother_name', v)} />
      <FormField label="Mother's Occupation" value={form.mother_occupation} onChangeText={(v) => onChange('mother_occupation', v)} />
      <FormField label="Number of Brothers" value={form.number_of_brothers} onChangeText={(v) => onChange('number_of_brothers', v)} keyboardType="number-pad" />
      <FormField label="Number of Sisters" value={form.number_of_sisters} onChangeText={(v) => onChange('number_of_sisters', v)} keyboardType="number-pad" />
      <FormField label="Sibling Details" value={form.sibling_details} onChangeText={(v) => onChange('sibling_details', v)} multiline />

      <Text style={styles.sectionTitle}>Location</Text>
      <PickerField label="State" value={form.state} onValueChange={handleStateChange} options={INDIA_STATES} />
      <SearchablePickerModal label="City" value={form.city} onSelect={(v) => onChange('city', v)} options={cityOptions} disabled={!form.state} />
      <FormField label="Country" value={form.country} editable={false} />

      <Text style={styles.sectionTitle}>About Me</Text>
      <FormField value={form.about_me} onChangeText={(v) => onChange('about_me', v)} multiline maxLength={1000} />

      <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: spacing.lg },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
