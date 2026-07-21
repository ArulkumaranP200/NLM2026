import { View, Text, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import { colors, spacing } from '../../constants/theme';

export default function StepFamily({ form, errors, onChange }) {
  return (
    <View>
      <Text style={styles.heading}>Family Details</Text>
      <FormField label="Father's Name (optional)" value={form.father_name} onChangeText={(v) => onChange('father_name', v)} error={errors.father_name} />
      <FormField label="Father's Occupation (optional)" value={form.father_occupation} onChangeText={(v) => onChange('father_occupation', v)} placeholder="e.g. Retired, Business" error={errors.father_occupation} />
      <FormField label="Mother's Name (optional)" value={form.mother_name} onChangeText={(v) => onChange('mother_name', v)} error={errors.mother_name} />
      <FormField label="Mother's Occupation (optional)" value={form.mother_occupation} onChangeText={(v) => onChange('mother_occupation', v)} placeholder="e.g. Homemaker, Teacher" error={errors.mother_occupation} />
      <FormField label="Number of Brothers" value={form.number_of_brothers} onChangeText={(v) => onChange('number_of_brothers', v)} keyboardType="number-pad" placeholder="e.g. 1" error={errors.number_of_brothers} />
      <FormField label="Number of Sisters" value={form.number_of_sisters} onChangeText={(v) => onChange('number_of_sisters', v)} keyboardType="number-pad" placeholder="e.g. 1" error={errors.number_of_sisters} />
      <FormField
        label="Sibling Details (optional)" value={form.sibling_details} onChangeText={(v) => onChange('sibling_details', v)}
        placeholder="e.g. Elder brother married, working as an engineer in Chennai" multiline error={errors.sibling_details}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
