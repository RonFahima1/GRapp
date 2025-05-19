import { Redirect } from 'expo-router';

export default function RegisterRedirect() {
  // Use Redirect component to handle initial navigation in Expo Router
  return <Redirect href="/register/personal-info" />;
}
