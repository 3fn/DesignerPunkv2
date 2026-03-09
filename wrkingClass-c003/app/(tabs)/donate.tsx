import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Heart, Shield, Users, TrendingUp, CircleCheck as CheckCircle, Star, DollarSign, CreditCard, Smartphone } from 'lucide-react-native';
import { useState } from 'react';

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
}

const donationTiers: DonationTier[] = [
  {
    id: 'supporter',
    name: 'Civic Supporter',
    amount: 5,
    description: 'Help us keep the lights on and maintain our servers',
    benefits: [
      'Support transparent democracy',
      'Help maintain our free service',
      'Contribute to civic engagement'
    ]
  },
  {
    id: 'advocate',
    name: 'Democracy Advocate',
    amount: 15,
    description: 'Support enhanced features and faster updates',
    benefits: [
      'All Supporter benefits',
      'Priority feature requests',
      'Early access to new tools',
      'Monthly impact reports'
    ],
    popular: true
  },
  {
    id: 'champion',
    name: 'Civic Champion',
    amount: 50,
    description: 'Champion comprehensive civic engagement tools',
    benefits: [
      'All Advocate benefits',
      'Quarterly virtual town halls',
      'Direct feedback channel',
      'Recognition in our community'
    ]
  },
  {
    id: 'patron',
    name: 'Democracy Patron',
    amount: 100,
    description: 'Become a cornerstone supporter of civic transparency',
    benefits: [
      'All Champion benefits',
      'Annual impact summary',
      'Advisory board consideration',
      'Custom feature consultation'
    ]
  }
];

const customAmounts = [10, 25, 75, 150];

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState<string>('advocate');
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [donationType, setDonationType] = useState<'monthly' | 'one-time'>('monthly');

  const handleDonationSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setCustomAmount(null);
  };

  const handleCustomAmountSelect = (amount: number) => {
    setCustomAmount(amount);
    setSelectedTier('');
  };

  const getSelectedAmount = () => {
    if (customAmount) return customAmount;
    const tier = donationTiers.find(t => t.id === selectedTier);
    return tier?.amount || 0;
  };

  const handleDonate = () => {
    const amount = getSelectedAmount();
    // In a real app, this would integrate with a payment processor
    // For now, we'll show a placeholder
    console.log(`Processing ${donationType} donation of $${amount}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Heart color="#DC2626" size={32} />
          </View>
          <Text style={styles.heroTitle}>Support Civic Transparency</Text>
          <Text style={styles.heroSubtitle}>
            Help us build a more informed democracy by supporting our mission to make government accessible to everyone.
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            We are a non-politically affiliated, nonprofit organization dedicated to empowering citizens with the tools they need to:
          </Text>
          
          <View style={styles.missionPoints}>
            <View style={styles.missionPoint}>
              <TrendingUp color="#2563EB" size={20} />
              <Text style={styles.missionPointText}>
                Understand how government decisions impact you personally
              </Text>
            </View>
            
            <View style={styles.missionPoint}>
              <Users color="#059669" size={20} />
              <Text style={styles.missionPointText}>
                Express your views to elected officials effectively
              </Text>
            </View>
            
            <View style={styles.missionPoint}>
              <Shield color="#7C3AED" size={20} />
              <Text style={styles.missionPointText}>
                Track how well representatives serve your interests
              </Text>
            </View>
          </View>
        </View>

        {/* Impact Stats */}
        <View style={styles.impactSection}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2.3M</Text>
              <Text style={styles.statLabel}>Bills Analyzed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>180K</Text>
              <Text style={styles.statLabel}>Letters Sent</Text>
            </View>
          </View>
        </View>

        {/* Donation Type Toggle */}
        <View style={styles.donationTypeSection}>
          <Text style={styles.sectionTitle}>Choose Your Support</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                donationType === 'monthly' && styles.toggleButtonActive
              ]}
              onPress={() => setDonationType('monthly')}
            >
              <Text style={[
                styles.toggleButtonText,
                donationType === 'monthly' && styles.toggleButtonTextActive
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                donationType === 'one-time' && styles.toggleButtonActive
              ]}
              onPress={() => setDonationType('one-time')}
            >
              <Text style={[
                styles.toggleButtonText,
                donationType === 'one-time' && styles.toggleButtonTextActive
              ]}>
                One-time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donation Tiers */}
        <View style={styles.tiersSection}>
          <Text style={styles.sectionTitle}>Donation Tiers</Text>
          <View style={styles.tiersGrid}>
            {donationTiers.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.tierCard,
                  selectedTier === tier.id && styles.tierCardSelected,
                  tier.popular && styles.tierCardPopular
                ]}
                onPress={() => handleDonationSelect(tier.id)}
              >
                {tier.popular && (
                  <View style={styles.popularBadge}>
                    <Star color="#FFFFFF" size={12} />
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                
                <Text style={styles.tierName}>{tier.name}</Text>
                <View style={styles.tierAmount}>
                  <Text style={styles.tierAmountSymbol}>$</Text>
                  <Text style={styles.tierAmountNumber}>{tier.amount}</Text>
                  <Text style={styles.tierAmountPeriod}>/{donationType === 'monthly' ? 'mo' : 'once'}</Text>
                </View>
                
                <Text style={styles.tierDescription}>{tier.description}</Text>
                
                <View style={styles.tierBenefits}>
                  {tier.benefits.map((benefit, index) => (
                    <View key={index} style={styles.tierBenefit}>
                      <CheckCircle color="#059669" size={16} />
                      <Text style={styles.tierBenefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount */}
        <View style={styles.customSection}>
          <Text style={styles.sectionTitle}>Or Choose Your Own Amount</Text>
          <View style={styles.customAmountsGrid}>
            {customAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.customAmountButton,
                  customAmount === amount && styles.customAmountButtonSelected
                ]}
                onPress={() => handleCustomAmountSelect(amount)}
              >
                <Text style={[
                  styles.customAmountText,
                  customAmount === amount && styles.customAmountTextSelected
                ]}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Your donation is secure and tax-deductible</Text>
          <View style={styles.trustIndicators}>
            <View style={styles.trustIndicator}>
              <Shield color="#059669" size={20} />
              <Text style={styles.trustText}>SSL Encrypted</Text>
            </View>
            <View style={styles.trustIndicator}>
              <CheckCircle color="#059669" size={20} />
              <Text style={styles.trustText}>501(c)(3) Nonprofit</Text>
            </View>
            <View style={styles.trustIndicator}>
              <Heart color="#059669" size={20} />
              <Text style={styles.trustText}>100% Transparent</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Donation CTA */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaAmount}>
            ${getSelectedAmount()}{donationType === 'monthly' ? '/month' : ' one-time'}
          </Text>
          <Text style={styles.ctaDescription}>
            {donationType === 'monthly' 
              ? `Support democracy with $${getSelectedAmount()} monthly`
              : `Make a one-time contribution of $${getSelectedAmount()}`
            }
          </Text>
        </View>
        
        <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
          <CreditCard color="#FFFFFF" size={20} />
          <Text style={styles.donateButtonText}>
            Donate ${getSelectedAmount()}
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  heroIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#FEF2F2',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  missionPoints: {
    gap: 16,
  },
  missionPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  missionPointText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginLeft: 12,
    flex: 1,
  },
  impactSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  donationTypeSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#1F2937',
  },
  tiersSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  tiersGrid: {
    gap: 16,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tierCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  tierCardPopular: {
    borderColor: '#F59E0B',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tierName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tierAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  tierAmountSymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
  },
  tierAmountNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563EB',
  },
  tierAmountPeriod: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  tierDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tierBenefits: {
    gap: 8,
  },
  tierBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierBenefitText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  customSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  customAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  customAmountButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  customAmountButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  customAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  customAmountTextSelected: {
    color: '#2563EB',
  },
  trustSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  trustIndicator: {
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  ctaSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ctaContent: {
    flex: 1,
  },
  ctaAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  donateButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});