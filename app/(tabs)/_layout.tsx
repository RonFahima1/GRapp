import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Home, User } from 'lucide-react-native';
import { useTranslation } from '@/context/I18nContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0.5,
          borderTopColor: '#E0E0E0',
          backgroundColor: '#FFFFFF',
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: 0,
        },
        tabBarIconStyle: {
          marginTop: 15, // Center the icons vertically
        },
        tabBarItemStyle: {
          flex: 1, // Make each item take equal space
        },
        tabBarShowLabel: false, // Hide the text labels
        tabBarActiveTintColor: '#666666',
        tabBarInactiveTintColor: '#AAAAAA',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="g"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.gIconContainer}>
              <Text style={[styles.gIcon, { color }]}>G</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
      {/* Hide the my-account tab from the tab bar */}
      <Tabs.Screen
        name="my-account"
        options={{
          href: null, // This prevents the tab from being accessible via the tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 11,
    marginBottom: 6,
    marginTop: -2,
  },
  gIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gIcon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8A8A8A',
  },
  plusSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A8A8A',
    top: -2,
  },
});