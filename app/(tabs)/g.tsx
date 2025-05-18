import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, CreditCard, Banknote, Maximize2, MessageCircle, DollarSign } from 'lucide-react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { RTLText } from '../../components/RTLProvider';
import { getRTLFlexDirection, getRTLTextAlign } from '../../utils/rtlUtils';

export default function GScreen() {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>('forex');

  // Fallback for missing translations
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key) || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const sections = [
    {
      id: 'transfers',
      title: getTranslation('g.transfers', 'Transfers & Payments'),
      icon: <Share2 color="#333" size={24} />,
      expanded: expandedSection === 'transfers',
      items: [
        { id: 'money-transfer', title: getTranslation('g.money_transfer', 'Money Transfer') },
        { id: 'payment-without-card', title: getTranslation('g.payment_without_card', 'Payment Without Card') }
      ]
    },
    {
      id: 'paynow',
      title: getTranslation('g.paynow', 'Pay Now'),
      icon: <DollarSign color="#333" size={24} />,
      expanded: expandedSection === 'paynow',
      items: []
    },
    {
      id: 'checks',
      title: getTranslation('g.checks', 'Checks'),
      icon: <Banknote color="#333" size={24} />,
      expanded: expandedSection === 'checks',
      items: []
    },
    {
      id: 'statements',
      title: getTranslation('g.statements', 'Statements'),
      icon: <Maximize2 color="#333" size={24} />,
      expanded: expandedSection === 'statements',
      items: []
    },
    {
      id: 'cards',
      title: getTranslation('g.cards', 'Cards'),
      icon: <CreditCard color="#333" size={24} />,
      expanded: expandedSection === 'cards',
      items: []
    },
    {
      id: 'forex',
      title: getTranslation('g.forex', 'Foreign Exchange'),
      icon: <MessageCircle color="#333" size={24} />,
      expanded: expandedSection === 'forex',
      items: [
        { id: 'forex-management', title: getTranslation('g.forex_management', 'Forex Management') },
        { id: 'forex-settings', title: getTranslation('g.forex_settings', 'Forex Settings') },
        { id: 'forex-tax', title: getTranslation('g.forex_tax', 'Tax Information for Forex') }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <RTLText style={styles.headerTitle}>
          {getTranslation('g.header', 'End of week, good evening, happy weekend')}
        </RTLText>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.sectionHeader} 
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderContent}>
                {I18nManager.isRTL ? (
                  <>
                    <RTLText style={styles.sectionTitle}>{section.title}</RTLText>
                    <View style={styles.iconContainer}>
                      {section.icon}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.iconContainer}>
                      {section.icon}
                    </View>
                    <RTLText style={styles.sectionTitle}>{section.title}</RTLText>
                  </>
                )}
              </View>
              {section.expanded ? (
                <ChevronUp color="#999" size={20} />
              ) : (
                <ChevronDown color="#999" size={20} />
              )}
            </TouchableOpacity>

            {section.expanded && section.items.length > 0 && (
              <View style={styles.itemsContainer}>
                {section.items.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.item}
                    activeOpacity={0.7}
                  >
                    <RTLText style={styles.itemText}>{item.title}</RTLText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    textAlign: getRTLTextAlign('center'),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: getRTLFlexDirection('row'),
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderContent: {
    flexDirection: getRTLFlexDirection('row'),
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: I18nManager.isRTL ? 0 : 16,
    marginLeft: I18nManager.isRTL ? 16 : 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    textAlign: getRTLTextAlign('left'),
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemText: {
    fontSize: 15,
    color: '#555555',
    textAlign: getRTLTextAlign('left'),
    marginLeft: I18nManager.isRTL ? 0 : 40,
    marginRight: I18nManager.isRTL ? 40 : 0,
  },
});
