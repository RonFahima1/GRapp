import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  Platform
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../context/TranslationContext';
import { useTranslate } from '../context/TranslationContext';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronRight, Check } from 'lucide-react-native';
import IOSLanguageSelector from './IOSLanguageSelector';


// Storage keys
const LANGUAGE_KEY = 'user_language';
const PREFERRED_LANGUAGES_KEY = 'preferred_languages';

// iOS-style constants
const IOS_MODAL_BACKGROUND = '#F2F2F7';
const IOS_HEADER_BACKGROUND = '#FFFFFF';
const PRIMARY_TEXT_COLOR = '#000000';
const SUBTLE_BORDER_COLOR = '#D1D1D6';
const SUBTLE_TEXT_COLOR = '#8E8E93';
const ACCENT_COLOR = '#007AFF';
const DESTRUCTIVE_COLOR = '#FF3B30';
const DISABLED_COLOR = '#C7C7CC';

interface LanguagePreferencesProps {
  onSave?: () => void;
}

export function LanguagePreferences({ onSave }: LanguagePreferencesProps) {
  const { t, currentLanguage, changeLanguage, languages, isChangingLanguage } = useTranslate();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLanguage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferredLanguages, setPreferredLanguages] = useState<LanguageCode[]>([]);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  
  // Load preferred languages on mount
  useEffect(() => {
    loadPreferredLanguages();
  }, []);

  // Provide haptic feedback and sound when changing language
  const triggerFeedback = async () => {
    // Trigger haptic feedback on devices that support it
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Play a subtle sound effect
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/language-switch.mp3')
      );
      await sound.playAsync();
      
      // Unload the sound when finished
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Function to open the language picker modal
  const openLanguagePicker = () => {
    setShowLanguagePicker(true);
    triggerFeedback();
  };

  // Handle language selection from the iOS picker
  const handleSelectLanguage = async (language: string) => {
    if (language === selectedLanguage) return;
    
    setSelectedLanguage(language as LanguageCode);
    await updatePreferredLanguages(language as LanguageCode);
    await handleLanguageSelect(language as LanguageCode);
  };
  
  // Load user's preferred languages from secure storage
  const loadPreferredLanguages = async () => {
    try {
      const languages = await SecureStore.getItemAsync(PREFERRED_LANGUAGES_KEY);
      if (languages) {
        setPreferredLanguages(JSON.parse(languages));
      } else {
        // Initialize with current language if no preferences exist
        setPreferredLanguages([currentLanguage]);
        await savePreferredLanguages([currentLanguage]);
      }
    } catch (error) {
      console.error('Error loading preferred languages:', error);
      // Fallback to current language only
      setPreferredLanguages([currentLanguage]);
    }
  };
  
  // Save the user's preferred languages
  const savePreferredLanguages = async (languages: string[]) => {
    try {
      await SecureStore.setItemAsync(PREFERRED_LANGUAGES_KEY, JSON.stringify(languages));
    } catch (error) {
      console.error('Error saving preferred languages:', error);
    }
  };
  
  // Update preferred languages when selecting a new language
  const updatePreferredLanguages = async (language: LanguageCode) => {
    let updated = [...preferredLanguages];
    
    // If already in the list, move to the top
    if (updated.includes(language)) {
      updated = updated.filter(lang => lang !== language);
    } 
    
    // Add to the beginning of the list
    updated.unshift(language);
    
    // Limit to 5 preferred languages
    if (updated.length > 5) {
      updated = updated.slice(0, 5);
    }
    
    setPreferredLanguages(updated);
    await savePreferredLanguages(updated);
  };
  
  // Handle language selection with animation and feedback
  const handleLanguageSelect = async (language: LanguageCode) => {
    if (language === selectedLanguage) return;
    
    setSelectedLanguage(language);
    
    // Animate the selection
    scale.value = 0.95;
    setTimeout(() => {
      scale.value = 1;
    }, 200);
    
    // Trigger haptic feedback and sound
    await triggerFeedback();
    
    // Update preferred languages list
    await updatePreferredLanguages(language);
    
    // Show loading indicator
    setIsLoading(true);
    
    // Update the app language
    try {
      await changeLanguage(language);
      
      // Call the onSave callback if provided
      if (onSave) {
        setTimeout(() => {
          onSave();
        }, 300); // Allow time for animation
      }
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        t('error'),
        t('error_changing_language')
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create animated style for the cards
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });
  
  // Group languages by preferred and others
  const renderLanguageItem = ({ item: languageCode }: { item: LanguageCode }) => {
    const language = languages[languageCode];
    const isSelected = languageCode === selectedLanguage;
    
    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          isSelected && styles.selectedLanguageItem
        ]}
        onPress={openLanguagePicker}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={language.name}
        accessibilityState={{ selected: isSelected }}
      >
        <Animated.View 
          style={[
            styles.languageItemContent,
            isSelected && animatedCardStyle
          ]}
        >
          <Text style={[
            styles.languageName,
            isSelected && styles.selectedLanguageName
          ]}>
            {language.name}
          </Text>
          
          {isSelected && (
            <View style={styles.checkmark}>
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Render preferred languages section
  const renderPreferredLanguages = () => {
    if (preferredLanguages.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('preferred_languages')}</Text>
        <FlatList
          data={preferredLanguages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.preferredList}
        />
      </View>
    );
  };
  
  // Render all languages
  const renderAllLanguages = () => {
    const languageCodes = Object.keys(languages) as LanguageCode[];
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('all_languages')}</Text>
        <FlatList
          data={languageCodes}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={styles.languagesList}
        />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Loading Overlay */}
      {(isChangingLanguage || isLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={ACCENT_COLOR} />
          <Text style={styles.loadingText}>{t('changing_language', 'Changing language...')}</Text>
        </View>
      )}
      
      {/* Main Content */}
      {renderPreferredLanguages()}
      {renderAllLanguages()}
      
      {/* iOS-style Language Picker Modal */}
      <IOSLanguageSelector
        isVisible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: PRIMARY_TEXT_COLOR,
  },
  preferredList: {
    paddingVertical: 8,
  },
  languagesList: {
    paddingVertical: 8,
  },
  languageItem: {
    borderRadius: 12,
    backgroundColor: IOS_HEADER_BACKGROUND,
    marginRight: 8,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SUBTLE_BORDER_COLOR,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedLanguageItem: {
    borderColor: ACCENT_COLOR,
    backgroundColor: '#F0F8FF',
  },
  languageItemContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageName: {
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
  },
  selectedLanguageName: {
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: PRIMARY_TEXT_COLOR,
  },
});
