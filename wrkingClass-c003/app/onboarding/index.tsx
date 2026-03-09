import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Users, Heart, Briefcase } from 'lucide-react-native';

export default function OnboardingStart() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's Personalize Your Experience</Text>
        <Text style={styles.subtitle}>
          We'll ask you a few questions to understand how legislation might impact you
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <MapPin color="#2563EB" size={24} />
            <Text style={styles.stepText}>Your Location</Text>
          </View>
          <View style={styles.step}>
            <Users color="#059669" size={24} />
            <Text style={styles.stepText}>Demographics</Text>
          </View>
          <View style={styles.step}>
            <Briefcase color="#7C3AED" size={24} />
            <Text style={styles.stepText}>Work & Income</Text>
          </View>
          <View style={styles.step}>
            <Heart color="#DC2626" size={24} />
            <Text style={styles.stepText}>Interests</Text>
          </View>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Your information is kept private and secure. We only use it to provide personalized impact analysis.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/onboarding/location')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  stepsContainer: {
    marginBottom: 48,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 16,
  },
  privacyNote: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  privacyText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
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
});