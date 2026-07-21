import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/auth/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  // Only the browser preview needs a phone-sized frame — on a real device the
  // app already fills the whole screen, so this wrapper is a no-op there.
  if (Platform.OS !== 'web') {
    return <AppContent />;
  }

  return (
    <View style={styles.webBackdrop}>
      <View style={styles.webPhoneFrame}>
        <AppContent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
    padding: 24,
  },
  webPhoneFrame: {
    width: 390,
    height: 844,
    maxHeight: '95vh',
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#111',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
});
