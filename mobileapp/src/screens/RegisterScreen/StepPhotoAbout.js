import { View, Text, StyleSheet } from 'react-native';
import ImagePickerAvatar from '../../components/ImagePickerAvatar';
import FormField from '../../components/FormField';
import { colors, spacing } from '../../constants/theme';

export default function StepPhotoAbout({ form, errors, onChange, photo, onPhotoChange }) {
  return (
    <View>
      <Text style={styles.heading}>Photo & About You</Text>
      <ImagePickerAvatar uri={photo?.uri} onChange={onPhotoChange} />
      <View style={{ marginTop: spacing.lg }}>
        <FormField
          label="About Me (optional)" value={form.about_me} onChangeText={(v) => onChange('about_me', v)}
          placeholder="Write a brief description about yourself, your interests, and what you're looking for..."
          multiline error={errors.about_me}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
