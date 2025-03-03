import { jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PersonalInfo from '../../app/register/personal-info';
import { AuthProvider } from '../../context/auth-context';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth context
jest.mock('../../context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    updateRegistrationData: jest.fn(),
    registrationData: {},
  }),
}));

describe('PersonalInfo Screen', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    // Check if all form elements are present
    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByText('Gender *')).toBeTruthy();
    expect(getByText('Nationality *')).toBeTruthy();
    expect(getByPlaceholderText('City')).toBeTruthy();
    expect(getByPlaceholderText('Address')).toBeTruthy();
  });

  it('shows error when submitting empty form', async () => {
    const { getByText } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText(/Please fill in:/)).toBeTruthy();
    });
  });

  it('handles form input correctly', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('City'), 'New York');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');

    // Verify the input values
    expect(getByPlaceholderText('First Name').props.value).toBe('John');
    expect(getByPlaceholderText('Last Name').props.value).toBe('Doe');
    expect(getByPlaceholderText('City').props.value).toBe('New York');
    expect(getByPlaceholderText('Address').props.value).toBe('123 Main St');
  });

  it('handles phone country code changes correctly', async () => {
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    // Check default value is Israel (+972)
    const phoneDropdown = getByTestId('phone-country-picker');
    expect(phoneDropdown.props.value).toBe('+972');

    // Change to USA (+1)
    fireEvent.changeText(phoneDropdown, '+1');
    expect(phoneDropdown.props.value).toBe('+1');

    // Change to UK (+44)
    fireEvent.changeText(phoneDropdown, '+44');
    expect(phoneDropdown.props.value).toBe('+44');

    // Test undefined value defaults back to Israel
    fireEvent.changeText(phoneDropdown, undefined);
    expect(phoneDropdown.props.value).toBe('+972');
  });

  it('validates phone number format', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    const phoneInput = getByPlaceholderText('Phone Number');
    const phoneDropdown = getByTestId('phone-country-picker');

    // Test with Israel format (+972)
    fireEvent.changeText(phoneDropdown, '+972');
    fireEvent.changeText(phoneInput, '501234567');
    expect(phoneInput.props.value).toBe('501234567');

    // Test with US format (+1)
    fireEvent.changeText(phoneDropdown, '+1');
    fireEvent.changeText(phoneInput, '2125551234');
    expect(phoneInput.props.value).toBe('2125551234');
  });

  it('navigates to next screen when form is valid', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <PersonalInfo />
      </AuthProvider>
    );

    // Fill in all required fields
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('City'), 'New York');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');

    // Submit form
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/register/id-verification');
    });
  });
});
