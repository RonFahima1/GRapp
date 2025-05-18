import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Redirect to the G page
  return (
    <Redirect href="/(tabs)/g" />
  );
}