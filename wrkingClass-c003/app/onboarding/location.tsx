import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, MapPin } from 'lucide-react-native';

export default function LocationStep() {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const handleZipCodeChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setZipCode(numericText);
    
    // Auto-dismiss keyboard and validate when 5 digits are entered
    if (numericText.length === 5) {
      Keyboard.dismiss();
      if (validateZipCode(numericText)) {
        // Auto-continue after a brief delay to show the complete zip code
        setTimeout(() => {
          handleContinue();
        }, 500);
      }
    }
  };

  const handleContinue = async () => {
    if (!zipCode.trim()) {
      Alert.alert('Required Field', 'Please enter your zip code');
      return;
    }

    if (!validateZipCode(zipCode)) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit zip code');
      return;
    }

    setLoading(true);
    
    // Store zip code for profile
    // In a real app, you'd use AsyncStorage or a state management solution
    global.userProfile = { ...global.userProfile, zipCode };
    
    // Simulate API call to validate zip code and get location info
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding/demographics');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#6B7280" size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin color="#2563EB" size={32} />
        </View>
        
        <Text style={styles.title}>What's your zip code?</Text>
        <Text style={styles.subtitle}>
          We'll use this to identify which federal, state, and local governments affect you
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your 5-digit zip code"
            placeholderTextColor="#9CA3AF"
            value={zipCode}
            onChangeText={handleZipCodeChange}
            keyboardType="numeric"
            maxLength={5}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              if (validateZipCode(zipCode)) {
                handleContinue();
              }
            }}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 We'll identify your Congressional district, state representatives, and local government jurisdictions
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, (!zipCode || !validateZipCode(zipCode)) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!zipCode || !validateZipCode(zipCode) || loading}
        >
          <Text style={[styles.continueButtonText, (!zipCode || !validateZipCode(zipCode)) && styles.buttonTextDisabled]}>
            {loading ? 'Validating...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginLeft: 8,
  },
  progressActive: {
    backgroundColor: '#2563EB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#EFF6FF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  infoBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  infoText: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});