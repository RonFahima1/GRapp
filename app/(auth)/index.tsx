import { Redirect } from 'expo-router';

export default function AuthIndex() {
  // Redirect to the welcome screen by default
  return <Redirect href="/send" />;
}
