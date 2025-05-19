import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Home, User, Circle } from 'lucide-react-native'; // Added Circle icon
import { useTranslate } from '../../context/TranslationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * THIS COMPONENT DEFINES THE TAB BAR WITH EXACTLY 3 TABS:
 * 1. Home (with wallet functionality)
 * 2. G
 * 3. Profile
 * 
 * THERE MUST BE EXACTLY 3 TABS. NO MORE.
 */
export default function TabLayout() {
  const { t, isRTL } = useTranslate();
  const insets = useSafeAreaInsets();

  // Create a tab layout with exactly 3 tabs
  return (
    <Tabs
      // Important: This ensures exactly 3 tabs with the correct icons
      initialRouteName="home-new"
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
          marginTop: 5, 
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#666666',
        tabBarInactiveTintColor: '#AAAAAA',
      }}
    >
      {/* TAB 1: Home (includes wallet functionality) */}
      <Tabs.Screen
        name="home-new"
        options={{
          title: t('tabs.home'),
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Home color={color} size={24} />
            </View>
          ),
        }}
      />

      {/* TAB 2: G */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.g'),
          tabBarLabel: t('tabs.g'),
          tabBarIcon: ({ color, focused }) => {
            // Use proper TypeScript type for props
            const CustomG = (props: {color: string}) => (
              <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{
                  color: props.color,
                  fontSize: 21,
                  fontWeight: '700',
                  textAlign: 'center',
                  height: 24,
                  lineHeight: 24
                }}>G</Text>
              </View>
            );
            
            return (
              <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
                <CustomG color={color} />
              </View>
            );
          },
        }}
      />

      {/* TAB 3: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <User color={color} size={24} />
            </View>
          ),
        }}
      />
      
      {/* IMPORTANT: NO ADDITIONAL TABS BEYOND THIS POINT */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    borderRadius: 50,
  },
  activeIconContainer: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 50,
  },
  svgIconContainer: {
    // Exact dimensions to match the SVG icons used by Home and Profile
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gLogo: {
    fontSize: 19, 
    fontWeight: '700',
    includeFontPadding: false,
    marginTop: 0,
    textAlign: 'center',
    fontFamily: 'System',
    height: 24,
    lineHeight: 24,
  },
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
});