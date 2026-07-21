import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import DateField from '../../components/DateField';
import { colors, spacing } from '../../constants/theme';
import { GENDERS, MARITAL_STATUSES, RELIGIONS, religionLabel } from '../../data/staticOptions';
import { INDIAN_LANGUAGES } from '../../data/languages';
import { fetchCastes } from '../../api/castes';

const RELIGION_OPTIONS = RELIGIONS.map((r) => ({ value: r, label: religionLabel(r) }));

function handlePhone(text, onChange) {
  onChange('phone', text.replace(/\D/g, '').slice(0, 10));
}

export default function StepPersonal({ form, errors, onChange }) {
  const [casteOptions, setCasteOptions] = useState([]);

  useEffect(() => {
    if (!form.religion) { setCasteOptions([]); return; }
    let active = true;
    fetchCastes(form.religion).then((data) => { if (active) setCasteOptions(data); });
    return () => { active = false; };
  }, [form.religion]);

  const handleReligionChange = (v) => {
    onChange('religion', v);
    onChange('caste', '');
    onChange('caste_other', '');
  };

  return (
    <View>
      <Text style={styles.heading}>Personal Details</Text>

      <FormField
        label="Phone Number" value={form.phone} onChangeText={(v) => handlePhone(v, onChange)}
        placeholder="10-digit mobile number" keyboardType="number-pad" maxLength={10}
        error={errors.phone} required
      />
      <DateField label="Date of Birth" value={form.date_of_birth} onChange={(v) => onChange('date_of_birth', v)} error={errors.date_of_birth} required maximumDate={new Date()} />

      <PickerField label="Gender" value={form.gender} onValueChange={(v) => onChange('gender', v)} options={GENDERS} placeholder="Select Gender" error={errors.gender} required />
      {form.gender === 'other' && (
        <FormField value={form.gender_other} onChangeText={(v) => onChange('gender_other', v)} placeholder="Please specify" error={errors.gender_other} />
      )}

      <PickerField label="Religion" value={form.religion} onValueChange={handleReligionChange} options={RELIGION_OPTIONS} placeholder="Select Religion" error={errors.religion} required />
      {form.religion === 'other' && (
        <FormField value={form.religion_other} onChangeText={(v) => onChange('religion_other', v)} placeholder="Please specify" error={errors.religion_other} />
      )}

      <PickerField label="Mother Tongue" value={form.mother_tongue} onValueChange={(v) => onChange('mother_tongue', v)} options={INDIAN_LANGUAGES} placeholder="Select Mother Tongue" error={errors.mother_tongue} required />
      {form.mother_tongue === 'Other' && (
        <FormField value={form.mother_tongue_other} onChangeText={(v) => onChange('mother_tongue_other', v)} placeholder="Please specify" error={errors.mother_tongue_other} />
      )}

      <PickerField label="Marital Status" value={form.marital_status} onValueChange={(v) => onChange('marital_status', v)} options={MARITAL_STATUSES} placeholder="Select Status" error={errors.marital_status} required />
      {form.marital_status === 'other' && (
        <FormField value={form.marital_status_other} onChangeText={(v) => onChange('marital_status_other', v)} placeholder="Please specify" error={errors.marital_status_other} />
      )}

      <PickerField
        label="Caste (optional)" value={form.caste} onValueChange={(v) => onChange('caste', v)}
        options={casteOptions} placeholder={form.religion ? 'Select Caste' : 'Select religion first'}
        error={errors.caste} enabled={!!form.religion}
      />
      {form.caste === 'Other' && (
        <FormField value={form.caste_other} onChangeText={(v) => onChange('caste_other', v)} placeholder="Please specify your caste" error={errors.caste_other} />
      )}

      <FormField label="Height (cm)" value={form.height} onChangeText={(v) => onChange('height', v)} placeholder="e.g. 165" keyboardType="number-pad" error={errors.height} />
      <FormField label="Weight (kg)" value={form.weight} onChangeText={(v) => onChange('weight', v)} placeholder="e.g. 60" keyboardType="number-pad" error={errors.weight} />
      <FormField label="Present Address" value={form.present_address} onChangeText={(v) => onChange('present_address', v)} placeholder="Door No, Street, Area" multiline error={errors.present_address} />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
