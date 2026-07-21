import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { initialOf } from '../utils/formatters';

export default function AvatarImage({ uri, name, size = 56 }) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dim]} />;
  }
  return (
    <View style={[styles.placeholder, dim]}>
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{initialOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border },
  placeholder: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  letter: { color: '#fff', fontWeight: '700' },
});
