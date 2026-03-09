import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, Heart, DollarSign, Briefcase, Users as FamilyIcon, UserCheck, UserX, Baby, Users } from 'lucide-react-native';

interface Interest {
  id: string;
  label: string;
  icon: string;
}

const interests: Interest[] = [
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'environment', label: 'Environment', icon: '🌱' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'defense', label: 'National Defense', icon: '🛡️' },
  { id: 'economy', label: 'Economy & Trade', icon: '📈' },
  { id: 'immigration', label: 'Immigration', icon: '🌍' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'transportation', label: 'Transportation', icon: '🚗' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'civil-rights', label: 'Civil Rights', icon: '⚖️' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
];

const incomeRanges = [
  { id: 'under-25k', label: 'Under $25,000' },
  { id: '25k-80k', label: '$25,000 - $80,000' },
  { id: '80k-200k', label: '$80,000 - $200,000' },
  { id: '200k-350k', label: '$200,000 - $350,000' },
  { id: 'over-350k', label: 'Over $350,000' },
];

const childrenCounts = [
  { id: '1', label: '1 child' },
  { id: '2', label: '2 children' },
  { id: '3', label: '3 children' },
  { id: '4', label: '4 children' },
  { id: '5+', label: '5+ children' },
];

export default function InterestsStep() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobIndustry, setJobIndustry] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  
  // Family fields
  const [isMarried, setIsMarried] = useState<boolean | undefined>(undefined);
  const [hasChildren, setHasChildren] = useState<boolean | undefined>(undefined);
  const [childrenCount, setChildrenCount] = useState('');
  const [caresForElderly, setCaresForElderly] = useState<boolean | undefined>(undefined);
  const [elderlyAreDependent, setElderlyAreDependent] = useState<boolean | undefined>(undefined);

  const canContinue = selectedInterests.length > 0 && selectedIncome;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (canContinue) {
      // Store interests, work data, and family data for profile
      global.userProfile = {
        ...global.userProfile,
        interests: selectedInterests,
        jobTitle: jobTitle || 'Not specified',
        jobIndustry: jobIndustry || 'Not specified',
        incomeRange: selectedIncome,
        isMarried,
        hasChildren,
        childrenCount: hasChildren ? childrenCount : undefined,
        caresForElderly,
        elderlyAreDependent: caresForElderly ? elderlyAreDependent : undefined,
      };
      router.push('/onboarding/complete');
    }
  };

  const renderBooleanSelector = (
    title: string,
    value: boolean | undefined,
    onSelect: (value: boolean | undefined) => void,
    trueLabel: string = 'Yes',
    falseLabel: string = 'No'
  ) => (
    <View style={styles.booleanSelectorContainer}>
      <Text style={styles.booleanSelectorTitle}>{title}</Text>
      <View style={styles.booleanContainer}>
        <TouchableOpacity
          style={[
            styles.booleanOption,
            value === true && styles.booleanOptionSelected
          ]}
          onPress={() => onSelect(value === true ? undefined : true)}
        >
          <Text style={[
            styles.booleanOptionText,
            value === true && styles.booleanOptionTextSelected
          ]}>
            {trueLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.booleanOption,
            value === false && styles.booleanOptionSelected
          ]}
          onPress={() => onSelect(value === false ? undefined : false)}
        >
          <Text style={[
            styles.booleanOptionText,
            value === false && styles.booleanOptionTextSelected
          ]}>
            {falseLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChildrenCountSelector = () => (
    <View style={styles.childrenCountContainer}>
      <Text style={styles.childrenCountTitle}>How many children do you have?</Text>
      <View style={styles.childrenCountOptions}>
        {childrenCounts.map((count) => (
          <TouchableOpacity
            key={count.id}
            style={[
              styles.childrenCountOption,
              childrenCount === count.id && styles.childrenCountSelected
            ]}
            onPress={() => setChildrenCount(count.id)}
          >
            <Text style={[
              styles.childrenCountText,
              childrenCount === count.id && styles.childrenCountTextSelected
            ]}>
              {count.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
          <View style={[styles.progressDot, styles.progressActive]} />
          <View style={[styles.progressDot, styles.progressActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Heart color="#7C3AED" size={32} />
          </View>
          
          <Text style={styles.title}>Your interests, income & family</Text>
          <Text style={styles.subtitle}>
            Tell us about your interests, income, work details, and family situation
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Topics of Interest ({selectedInterests.length}/3) 
              <Text style={styles.required}> *</Text>
            </Text>
            <Text style={styles.sectionSubtitle}>
              Select at least 1 topic you care most about (up to 3)
            </Text>
            <View style={styles.interestsGrid}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest.id) && styles.interestSelected
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                  disabled={selectedInterests.length >= 3 && !selectedInterests.includes(interest.id)}
                >
                  <Text style={styles.interestIcon}>{interest.icon}</Text>
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest.id) && styles.interestTextSelected
                  ]}>
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign color="#059669" size={20} />
              <Text style={styles.sectionTitle}>Annual Household Income</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.incomeContainer}>
              {incomeRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.incomeOption,
                    selectedIncome === range.id && styles.incomeSelected
                  ]}
                  onPress={() => setSelectedIncome(range.id)}
                >
                  <View style={styles.incomeOptionContent}>
                    <DollarSign 
                      color={selectedIncome === range.id ? '#059669' : '#6B7280'} 
                      size={20} 
                    />
                    <Text style={[
                      styles.incomeText,
                      selectedIncome === range.id && styles.incomeTextSelected
                    ]}>
                      {range.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Briefcase color="#7C3AED" size={20} />
              <Text style={styles.sectionTitle}>Work Information (Optional)</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Software Engineer, Teacher, Manager"
                placeholderTextColor="#9CA3AF"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Industry</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Technology, Healthcare, Finance"
                placeholderTextColor="#9CA3AF"
                value={jobIndustry}
                onChangeText={setJobIndustry}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.familySectionHeader}>
              <FamilyIcon color="#DC2626" size={20} />
              <Text style={styles.sectionTitle}>Family Information (Optional)</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              This helps us understand how family-related legislation might affect you
            </Text>
            
            {renderBooleanSelector('Are you married or in a civil union?', isMarried, setIsMarried)}
            
            {renderBooleanSelector('Do you have children?', hasChildren, setHasChildren)}
            
            {hasChildren === true && renderChildrenCountSelector()}
            
            {renderBooleanSelector('Do you care for elderly parents?', caresForElderly, setCaresForElderly)}
            
            {caresForElderly === true && renderBooleanSelector(
              'Are your elderly parents dependents?', 
              elderlyAreDependent, 
              setElderlyAreDependent
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={[styles.continueButtonText, !canContinue && styles.buttonTextDisabled]}>
            Complete Setup
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#FAF5FF',
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  required: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '600',
  },
  familySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  interestChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  interestIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  interestTextSelected: {
    color: '#7C3AED',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  incomeContainer: {
    flexDirection: 'column',
  },
  incomeOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
  },
  incomeSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  incomeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 12,
  },
  incomeTextSelected: {
    color: '#059669',
  },
  booleanSelectorContainer: {
    marginBottom: 20,
  },
  booleanSelectorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  booleanContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  booleanOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  booleanOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  booleanOptionTextSelected: {
    color: '#2563EB',
  },
  childrenCountContainer: {
    marginBottom: 20,
  },
  childrenCountTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  childrenCountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  childrenCountOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  childrenCountSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  childrenCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  childrenCountTextSelected: {
    color: '#059669',
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