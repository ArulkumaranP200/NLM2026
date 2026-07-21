import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}
