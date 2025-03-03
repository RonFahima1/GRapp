const { jest } = require('@jest/globals');

// Mock the expo-router navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the date picker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock the DropDownPicker
jest.mock('react-native-dropdown-picker', () => 'DropDownPicker');

// Mock react-native components
jest.mock('react-native', () => ({
  Platform: { select: jest.fn() },
  StyleSheet: { create: jest.fn() },
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  ScrollView: 'ScrollView',
}));

require('@testing-library/jest-native/extend-expect');
