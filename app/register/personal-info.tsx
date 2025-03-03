import { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { colors, spacing } from '../styles/theme';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/personal-info';

export default function PersonalInfo() {
  const { updateRegistrationData, registrationData } = useAuth();
  const [phoneCountryCode, setPhoneCountryCode] = useState('+972');
  const [phoneError, setPhoneError] = useState('');
  
  const handlePhoneCountryChange = (value: any) => {
    const newCode = value || '+972';
    setPhoneCountryCode(newCode);
    
    // Clear the phone number when changing country code
    setFormData(prev => ({ ...prev, phoneNumber: '' }));
    setPhoneError('');
  };

  const validatePhoneNumber = (number: string, countryCode: string = phoneCountryCode) => {
    if (!number) {
      setPhoneError('');
      return false;
    }

    // For Israel (+972), validate specific patterns
    if (countryCode === '+972') {
      // Remove any non-digit characters
      const digits = number.replace(/\D/g, '');
      
      // Israeli numbers should start with 0 or 5
      if (!digits.match(/^[05]/)) {
        setPhoneError('Number must start with 0 or 5');
        return false;
      }

      // Check length based on first digit
      if (digits.startsWith('0')) {
        if (digits.length !== 9) {
          setPhoneError('Number must be 9 digits when starting with 0');
          return false;
        }
      } else if (digits.startsWith('5')) {
        if (digits.length !== 9) {
          setPhoneError('Mobile number must be 9 digits');
          return false;
        }
      }

      try {
        const fullNumber = `+972${digits.startsWith('0') ? digits.slice(1) : digits}`;
        const isValid = isValidPhoneNumber(fullNumber);
        
        if (!isValid) {
          setPhoneError('Invalid phone number format');
          return false;
        }
        
        setPhoneError('');
        return true;
      } catch (error) {
        setPhoneError('Invalid phone number format');
        return false;
      }
    } else {
      try {
        const code = countryCode.startsWith('+') ? countryCode.slice(1) : countryCode;
        const fullNumber = `+${code}${number}`;
        const isValid = isValidPhoneNumber(fullNumber);
        
        if (!isValid) {
          setPhoneError('Invalid phone number for selected country');
          return false;
        }
        
        setPhoneError('');
        return true;
      } catch (error) {
        setPhoneError('Invalid phone number format');
        return false;
      }
    }
  };

  const [genderValue, setGenderValue] = useState<string>('');
  const [nationalityValue, setNationalityValue] = useState<string>('');
  const [cityValue, setCityValue] = useState<string>('');
  const [cityOpen, setCityOpen] = useState(false);
  const [cityItems, setCityItems] = useState<Array<{label: string, value: string}>>([]);

  // Initialize dropdown values when formData is available
  useEffect(() => {
    if (formData) {
      setGenderValue(formData.gender || '');
      setNationalityValue(formData.nationality || '');
      setCityValue(formData.city || '');
    }
  }, [formData]);

  // Initialize city dropdown with empty state
  useEffect(() => {
    setCityItems([
      { label: 'Tel Aviv', value: 'Tel Aviv' },
      { label: 'Jerusalem', value: 'Jerusalem' },
      { label: 'Haifa', value: 'Haifa' },
      { label: 'Rishon LeZion', value: 'Rishon LeZion' },
      { label: 'Petah Tikva', value: 'Petah Tikva' },
      { label: 'Ashdod', value: 'Ashdod' },
      { label: 'Netanya', value: 'Netanya' },
      { label: 'Beer Sheva', value: 'Beer Sheva' },
      { label: 'Holon', value: 'Holon' },
      { label: 'Ramat Gan', value: 'Ramat Gan' },
    ]);
  }, []);

  const handleGenderChange = (value: string) => {
    setGenderValue(value);
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleNationalityChange = (value: string) => {
    setNationalityValue(value);
    setFormData(prev => ({ ...prev, nationality: value }));
  };

  const handleCityChange = (value: string) => {
    setCityValue(value);
    setFormData(prev => ({ ...prev, city: value }));
  };

  const [phoneCountryOpen, setPhoneCountryOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: registrationData?.phoneNumber || '',
    firstName: registrationData?.firstName || '',
    middleName: registrationData?.middleName || '',
    lastName: registrationData?.lastName || '',
    dateOfBirth: registrationData?.dateOfBirth || null,
    gender: registrationData?.gender || '',
    nationality: registrationData?.nationality || '',
    city: registrationData?.city || '',
    address: registrationData?.address || '',
  });

  const [error, setError] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [genderItems] = useState([
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ]);

  const [phoneCountryItems] = useState([
    { label: '🇮🇱 +972', value: '+972', key: 'IL' },
    { label: '🇺🇸 +1', value: '+1-US', key: 'US' },
    { label: '🇬🇧 +44', value: '+44', key: 'GB' },
    { label: '🇦🇪 +971', value: '+971', key: 'AE' },
    { label: '🇨🇳 +86', value: '+86', key: 'CN' },
    { label: '🇮🇳 +91', value: '+91', key: 'IN' },
    { label: '🇯🇵 +81', value: '+81', key: 'JP' },
    { label: '🇰🇷 +82', value: '+82', key: 'KR' },
    { label: '🇩🇪 +49', value: '+49', key: 'DE' },
    { label: '🇫🇷 +33', value: '+33', key: 'FR' },
    { label: '🇮🇹 +39', value: '+39', key: 'IT' },
    { label: '🇷🇺 +7', value: '+7', key: 'RU' },
    { label: '🇨🇦 +1', value: '+1-CA', key: 'CA' },
    { label: '🇦🇺 +61', value: '+61', key: 'AU' },
    { label: '🇳🇿 +64', value: '+64', key: 'NZ' },
    { label: '🇸🇬 +65', value: '+65', key: 'SG' },
    { label: '🇭🇰 +852', value: '+852', key: 'HK' }
  ]);

  const [nationalityItems] = useState([
    { label: 'Afghanistan', value: 'AF' },
    { label: 'Albania', value: 'AL' },
    { label: 'Algeria', value: 'DZ' },
    { label: 'Andorra', value: 'AD' },
    { label: 'Angola', value: 'AO' },
    { label: 'Argentina', value: 'AR' },
    { label: 'Armenia', value: 'AM' },
    { label: 'Australia', value: 'AU' },
    { label: 'Austria', value: 'AT' },
    { label: 'Azerbaijan', value: 'AZ' },
    { label: 'Bahamas', value: 'BS' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Bangladesh', value: 'BD' },
    { label: 'Barbados', value: 'BB' },
    { label: 'Belarus', value: 'BY' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Belize', value: 'BZ' },
    { label: 'Benin', value: 'BJ' },
    { label: 'Bhutan', value: 'BT' },
    { label: 'Bolivia', value: 'BO' },
  ]);

  const handleNext = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'city', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    updateRegistrationData(formData);
    router.push('/register/id-verification');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backgroundLayer} />
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={20} style={styles.inputIcon} />
            <View style={[styles.input, styles.phoneDisplay]}>
              <View style={styles.phoneContent}>
                <Text style={styles.countryCodeText}>{phoneCountryCode}</Text>
                <Text style={styles.phoneNumber}>{formData.phoneNumber}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="First Name"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.middleName}
              onChangeText={(text) => setFormData({ ...formData, middleName: text })}
              placeholder="Middle Name (Optional)"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Last Name"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="cake" size={20} style={styles.inputIcon} />
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={formData.dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }
                }}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person-outline" size={20} style={styles.inputIcon} />
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={setGenderValue}
              onSelectItem={(item) => handleGenderChange(item.value)}
              style={styles.dropdown}
              containerStyle={{ marginBottom: 15 }}
              zIndex={3000}
              dropDownContainerStyle={styles.dropdownContainer}
              labelStyle={styles.dropdownLabel}
              listItemLabelStyle={styles.dropdownItemLabel}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={{ color: '#A0A0A0' }}
              placeholder="Select Gender"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="public" size={20} style={styles.inputIcon} />
            <DropDownPicker
              open={nationalityOpen}
              value={nationalityValue}
              items={nationalityItems}
              setOpen={setNationalityOpen}
              setValue={setNationalityValue}
              onSelectItem={(item) => handleNationalityChange(item.value)}
              style={styles.dropdown}
              containerStyle={{ marginBottom: 15 }}
              zIndex={2000}
              dropDownContainerStyle={styles.dropdownContainer}
              labelStyle={styles.dropdownLabel}
              listItemLabelStyle={styles.dropdownItemLabel}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={{ color: '#A0A0A0' }}
              placeholder="Select Nationality"
              searchable={true}
              searchPlaceholder="Search nationality..."
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-city" size={20} style={styles.inputIcon} />
            <DropDownPicker
              open={cityOpen}
              value={cityValue}
              items={cityItems}
              setOpen={setCityOpen}
              setValue={setCityValue}
              onSelectItem={(item) => handleCityChange(item.value)}
              style={styles.dropdown}
              containerStyle={{ marginBottom: 15 }}
              zIndex={1000}
              dropDownContainerStyle={styles.dropdownContainer}
              labelStyle={styles.dropdownLabel}
              listItemLabelStyle={styles.dropdownItemLabel}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={{ color: '#A0A0A0' }}
              placeholder="Select City"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="home" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Address"
              multiline
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text>Already have an account? </Text>
            <Link href="/login" style={styles.link}>Login</Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
