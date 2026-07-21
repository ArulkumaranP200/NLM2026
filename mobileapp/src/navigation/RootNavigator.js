import { useAuth } from '../auth/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return user ? <AppStack /> : <AuthStack />;
}
