import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing } from '../constants/theme';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ImagePickerAvatar({ uri, onChange, size = 140 }) {
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to upload a photo.');
      return;
    }
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_SIZE) {
        Alert.alert('Image too large', 'Please choose an image under 5MB.');
        return;
      }
      onChange(asset);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={pick} disabled={busy} style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.hint}>Upload photo</Text>
          </View>
        )}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{uri ? 'Change' : 'Upload'}</Text>
        </View>
      </Pressable>
      {uri ? (
        <Pressable onPress={() => onChange(null)}>
          <Text style={styles.removeText}>Remove Photo</Text>
        </Pressable>
      ) : (
        <Text style={styles.sizeHint}>JPG, PNG up to 5MB</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.sm },
  circle: {
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.primary, overflow: 'hidden',
  },
  image: { position: 'absolute' },
  placeholder: { alignItems: 'center' },
  icon: { fontSize: 28 },
  hint: { fontSize: 11, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4, alignItems: 'center',
  },
  overlayText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  removeText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  sizeHint: { color: colors.textMuted, fontSize: 11 },
});
