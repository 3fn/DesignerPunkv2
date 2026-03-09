import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';

export default function OnboardingComplete() {
  const router = useRouter();

  const handleFinish = () => {
    // Mark onboarding as complete
    global.userProfile = { ...global.userProfile, onboardingComplete: true };
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle color="#059669" size={64} />
        </View>
        
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>
          We're analyzing your profile to provide personalized insights about how legislation affects you.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Sparkles color="#2563EB" size={24} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personalized Analysis</Text>
              <Text style={styles.featureDescription}>
                Bills are analyzed based on your demographics, interests, and location
              </Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <CheckCircle color="#059669" size={24} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Updates</Text>
              <Text style={styles.featureDescription}>
                Get notified when new legislation affects your interests
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <Text style={styles.nextStepsText}>
            • Browse current legislation on your dashboard{'\n'}
            • Set up notification preferences{'\n'}
            • Explore how bills might impact you personally
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Start Exploring</Text>
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
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
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  nextStepsContainer: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  finishButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});