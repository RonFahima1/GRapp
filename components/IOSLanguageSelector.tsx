import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { SUPPORTED_LANGUAGES, useTranslate } from '../context/TranslationContext';

// iOS-style constants for consistent styling - exactly matching add-card.tsx
const IOS_MODAL_BACKGROUND = '#F2F2F7';
const IOS_HEADER_BACKGROUND = '#FFFFFF';
const PRIMARY_TEXT_COLOR = '#000000';
const SUBTLE_BORDER_COLOR = '#D1D1D6';
const SUBTLE_TEXT_COLOR = '#8E8E93';
const ACCENT_COLOR = '#007AFF';

// Interface for our language selector props
interface IOSLanguageSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

// Sound for picker selection
let pickerSound: Audio.Sound | null = null;
const loadPickerSound = async () => {
  try {
    if (Platform.OS !== 'web') {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/picker-click.mp3'),
        { volume: 0.3 }
      );
      pickerSound = sound;
    }
  } catch (error) {
    console.error('Failed to load picker sound', error);
  }
};

// Function to play picker sound
const playPickerSound = async () => {
  try {
    if (pickerSound && Platform.OS !== 'web') {
      await pickerSound.replayAsync();
    }
  } catch (error) {
    console.error('Failed to play picker sound', error);
  }
};

/**
 * A custom iOS-style language picker that exactly matches the credit card expiration picker
 * from add-card.tsx, including identical styling, haptic feedback, and sound effects.
 */
function IOSLanguageSelector({
  isVisible,
  onClose,
  selectedLanguage,
  onSelectLanguage
}: IOSLanguageSelectorProps) {
  const { t } = useTranslate();
  
  // Get the current selected language from props and prepare for picker
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<string>(selectedLanguage);
  
  // Load sound effect when component mounts
  useEffect(() => {
    loadPickerSound();
    return () => {
      if (pickerSound) {
        pickerSound.unloadAsync();
      }
    };
  }, []);
  
  // Function to provide haptic feedback with sound effect - matched with credit card picker
  const triggerFeedback = async () => {
    if (Platform.OS !== 'web') {
      // Medium impact haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Success notification with slight delay
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 40);
      
      // Play sound with minimal delay
      setTimeout(() => {
        playPickerSound();
      }, 5);
    }
  };
  
  // Handle confirmation when user presses Done
  const handleConfirm = () => {
    triggerFeedback();
    onSelectLanguage(tempSelectedLanguage);
    onClose();
  };
  
  // Handle cancel with light feedback
  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };
  
  // Create array of language options for the picker
  const languageOptions = Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => ({
    code,
    label: lang.nativeName
  }));
  
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.modalOverlay}/>
      </TouchableWithoutFeedback>
      
      <View style={styles.pickerModalContainer}>
        <View style={styles.pickerHeader}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.pickerButtonText}>{t('common.cancel', 'Cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.pickerTitle}>{t('language_settings.select_language', 'Select Language')}</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={[styles.pickerButtonText, styles.pickerButtonDone]}>{t('common.done', 'Done')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pickersRow}>
          <View style={styles.pickerColumn}>
            <Picker
              selectedValue={tempSelectedLanguage}
              onValueChange={(itemValue) => {
                setTempSelectedLanguage(itemValue);
                triggerFeedback();
              }}
              style={styles.pickerComponent}
              itemStyle={styles.pickerItem}
            >
              {languageOptions.map(item => (
                <Picker.Item key={item.code} label={item.label} value={item.code} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </Modal>
  );


}

// Styles for our iOS-style picker - exactly matched to the card expiration picker in add-card.tsx
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  pickerModalContainer: {
    backgroundColor: IOS_MODAL_BACKGROUND, // Use iOS modal background for consistency
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SUBTLE_BORDER_COLOR,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: PRIMARY_TEXT_COLOR,
  },
  pickerButtonText: {
    fontSize: 17,
    color: ACCENT_COLOR, // Standard iOS blue for actions
  },
  pickerButtonDone: {
    fontWeight: '600',
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10, // Space above pickers
  },
  pickerColumn: {
    flex: 1,
  },
  pickerComponent: {
    // On iOS, height is intrinsic. For Android, might need explicit height.
    width: '100%',
  },
  pickerItem: {
    // Style for individual picker items (iOS only)
    fontSize: 20,
  }
});

export default IOSLanguageSelector;
