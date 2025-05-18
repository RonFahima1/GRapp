import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Modal,
  I18nManager
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '../../hooks/useTranslation';
import { getRTLFlexDirection, getRTLTextAlign, getChevronTransform } from '../../utils/rtlUtils';
import { RTLText } from '../../components/RTLProvider';

type LanguageSelectorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  languages: { code: string; name: string }[];
};

export default function LanguageSelectorModal({
  isVisible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  languages
}: LanguageSelectorModalProps) {
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(selectedLanguage);
  const { t } = useTranslation();

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCancel = () => {
    handleTap();
    onClose();
  };

  const handleDone = () => {
    handleTap();
    onSelectLanguage(tempSelectedLanguage);
    onClose();
  };

  // Fallback text for missing translations
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key) || fallback;
    } catch (error) {
      return fallback;
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <RTLText style={styles.cancelText}>{getTranslation('common.cancel', 'Cancel')}</RTLText>
            </TouchableOpacity>
            <RTLText style={styles.headerTitle}>{getTranslation('common.selectLanguage', 'Select Language')}</RTLText>
            <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
              <RTLText style={styles.doneText}>{getTranslation('common.done', 'Done')}</RTLText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tempSelectedLanguage}
              onValueChange={(itemValue) => setTempSelectedLanguage(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {languages.map((language) => (
                <Picker.Item 
                  key={language.code} 
                  label={language.name} 
                  value={language.code} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: getRTLFlexDirection('row'),
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#999999',
    textAlign: getRTLTextAlign('left'),
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: getRTLTextAlign('right'),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: getRTLTextAlign('center'),
  },
  pickerContainer: {
    height: 200,
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
  },
});
