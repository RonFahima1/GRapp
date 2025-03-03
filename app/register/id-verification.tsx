import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function IdVerification() {
  const { login, registrationData } = useAuth();
  const [formData, setFormData] = useState({
    idType: '',
    idIssueByCountry: '',
    idNumber: '',
    idExpiryDate: new Date(),
  });

  const [error, setError] = useState('');
  const [idTypeOpen, setIdTypeOpen] = useState(false);
  const [idTypeItems] = useState([
    { label: 'Passport', value: 'PASSPORT' },
    { label: 'National ID', value: 'NATIONAL_ID' },
    { label: 'Drivers License', value: 'DRIVERS_LICENSE' }
  ]);

  const handleRegister = async () => {
    const requiredFields = ['idType', 'idIssueByCountry', 'idNumber', 'idExpiryDate'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}`);
      return;
    }

    try {
      // Combine data from both steps
      const completeRegistrationData = {
        ...registrationData,
        ...formData
      };

      // TODO: Implement your registration API call here
      console.log('Register:', completeRegistrationData);
      
      // After successful registration, log the user in
      await login(completeRegistrationData);
      router.replace('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/gr-logo-splash.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>Step 2 of 2: ID Verification</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFilled} />
        <View style={[styles.progressFilled]} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.infoText}>
          Please provide a valid government-issued ID to verify your identity. 
          This helps us maintain a secure platform for all users.
        </Text>

        <Text style={styles.label}>ID Type *</Text>
        <DropDownPicker
          open={idTypeOpen}
          value={formData.idType}
          items={idTypeItems}
          setOpen={setIdTypeOpen}
          setValue={(value) => setFormData({ ...formData, idType: value })}
          style={styles.dropdown}
          placeholder="Select ID type"
        />

        <Text style={styles.label}>ID Issuing Country *</Text>
        <TextInput
          style={styles.input}
          value={formData.idIssueByCountry}
          onChangeText={(text) => setFormData({ ...formData, idIssueByCountry: text })}
          placeholder="Enter issuing country"
        />

        <Text style={styles.label}>ID Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.idNumber}
          onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
          placeholder="Enter ID number"
        />

        <Text style={styles.label}>ID Expiry Date *</Text>
        <View style={styles.dateInputContainer}>
          <DateTimePicker
            value={formData.idExpiryDate}
            mode="date"
            display="default"
            onChange={(event, date) => date && setFormData({ ...formData, idExpiryDate: date })}
            minimumDate={new Date()}
            style={styles.dateInput}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    width: '100%',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#e0e0e0',
  },
  progressFilled: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  formContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ddd',
    zIndex: 1000,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 2,
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc3545',
    marginBottom: 10,
    fontSize: 14,
  },
});
