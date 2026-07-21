import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import HeaderLogoutButton from '../components/HeaderLogoutButton';
import { colors } from '../constants/theme';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileListScreen from '../screens/ProfileListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ExpectationsScreen from '../screens/ExpectationsScreen';
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';
import DeveloperPanelScreen from '../screens/developer/DeveloperPanelScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: '🏠',
  Browse: '🔍',
  'My Profile': '👤',
  Expectations: '💍',
  Admin: '🛡️',
  'Dev Panel': '🛠️',
};

function TabIcon({ route, focused }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{ICONS[route.name] || '•'}</Text>;
}

export default function AppTabs() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <HeaderLogoutButton />,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon route={route} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Browse" component={ProfileListScreen} options={{ title: 'Browse Profiles' }} />
      {role === 'user' && (
        <Tab.Screen name="My Profile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      )}
      {role === 'user' && (
        <Tab.Screen name="Expectations" component={ExpectationsScreen} />
      )}
      {(role === 'admin' || role === 'developer') && (
        <Tab.Screen name="Admin" component={AdminPanelScreen} options={{ title: 'Admin Panel' }} />
      )}
      {role === 'developer' && (
        <Tab.Screen name="Dev Panel" component={DeveloperPanelScreen} options={{ title: 'Developer Panel' }} />
      )}
    </Tab.Navigator>
  );
}
