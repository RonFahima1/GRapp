import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, X, PlusCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslate } from '../../context/TranslationContext';

export default function SupportChatScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  const [message, setMessage] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Placeholder for chat messages
  const [messages] = useState([
    {
      id: '1',
      sender: 'agent',
      message: 'Hi there! Welcome to Global Remit. How may I assist you today?',
      timestamp: '01:17',
    }
  ]);

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    handleTap();
    // In a real app, you would send the message to your backend
    // and update the messages state with the response
    setMessage('');
    
    // Just an alert for the placeholder implementation
    Alert.alert(t('supportChat.messageSent'), t('supportChat.messageSentDesc'));
  };

  // Exit chat confirmation
  const confirmExit = () => {
    handleTap();
    setShowExitConfirm(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={confirmExit}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('common.back')}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('supportChat.title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Chat area */}
      <ScrollView style={styles.chatContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{t('supportChat.today')}, {new Date().toLocaleDateString()}</Text>
        </View>
        
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageContainer,
              msg.sender === 'agent' ? styles.agentMessage : styles.userMessage
            ]}
          >
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
        
        {/* Quick reply options */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.accountQuestions')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.creditCards')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.appIssues')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.moneyTransfers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.accountAccess')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickReplyButton}>
              <Text style={styles.quickReplyText}>{t('supportChat.quickReplies.openAccount')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Message input area */}
      <View style={[styles.inputContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity style={styles.attachButton} accessibilityLabel={t('supportChat.attach')}>
          <PlusCircle color="#007AFF" size={24} />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={t('supportChat.typePlaceholder')}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          onPress={sendMessage}
          style={[styles.sendButton, message.trim() === '' ? styles.disabledButton : {}]}
          disabled={message.trim() === ''}
          accessibilityLabel={t('supportChat.send')}
        >
          <Send color="#007AFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Exit confirmation modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showExitConfirm}
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <X size={24} color="#999" onPress={() => setShowExitConfirm(false)} accessibilityLabel={t('common.close')} />
            </View>
            <Text style={[styles.modalTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('supportChat.exitConfirm.title')}</Text>
            <Text style={[styles.modalMessage, { textAlign: isRTL ? 'right' : 'left' }]}>{t('supportChat.exitConfirm.message')}</Text>
            <TouchableOpacity 
              style={styles.modalOptionButton}
              onPress={() => {
                setShowExitConfirm(false);
                router.back();
              }}
              accessibilityLabel={t('supportChat.exitConfirm.leave')}
            >
              <Text style={styles.modalOptionText}>{t('supportChat.exitConfirm.leave')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalOptionButton, styles.modalPrimaryButton]}
              onPress={() => setShowExitConfirm(false)}
              accessibilityLabel={t('supportChat.exitConfirm.continue')}
            >
              <Text style={styles.modalPrimaryText}>{t('supportChat.exitConfirm.continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  rightPlaceholder: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#999999',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  agentMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#E5E5EA',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    marginLeft: 8,
  },
  quickRepliesContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  quickReplyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quickReplyText: {
    fontSize: 14,
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalHeader: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOptionButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalPrimaryButton: {
    backgroundColor: '#000000',
  },
  modalPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
