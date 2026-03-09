import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Users, Briefcase, Heart, Smile as Family, Save, UserCheck, UserX, Baby, DollarSign } from 'lucide-react-native';

interface Interest {
  id: string;
  label: string;
  icon: string;
}

interface DemographicOption {
  id: string;
  label: string;
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

const ageRanges: DemographicOption[] = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55-64', label: '55-64' },
  { id: '65+', label: '65+' },
];

const genders: DemographicOption[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const incomeRanges: DemographicOption[] = [
  { id: 'under-25k', label: 'Under $25,000' },
  { id: '25k-80k', label: '$25,000 - $80,000' },
  { id: '80k-200k', label: '$80,000 - $200,000' },
  { id: '200k-350k', label: '$200,000 - $350,000' },
  { id: 'over-350k', label: 'Over $350,000' },
];

const childrenCounts: DemographicOption[] = [
  { id: '1', label: '1 child' },
  { id: '2', label: '2 children' },
  { id: '3', label: '3 children' },
  { id: '4', label: '4 children' },
  { id: '5+', label: '5+ children' },
];

export default function EditProfile() {
  const router = useRouter();
  
  // Location
  const [zipCode, setZipCode] = useState('');
  
  // Demographics
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  
  // Income & Work
  const [selectedIncome, setSelectedIncome] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobIndustry, setJobIndustry] = useState('');
  
  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Family
  const [isMarried, setIsMarried] = useState<boolean | undefined>(undefined);
  const [hasChildren, setHasChildren] = useState<boolean | undefined>(undefined);
  const [childrenCount, setChildrenCount] = useState('');
  const [caresForElderly, setCaresForElderly] = useState<boolean | undefined>(undefined);
  const [elderlyAreDependent, setElderlyAreDependent] = useState<boolean | undefined>(undefined);

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing profile data
    const profile = global.userProfile || {};
    
    setZipCode(profile.zipCode || '');
    setSelectedAge(profile.ageRange || '');
    setSelectedGender(profile.gender || '');
    setSelectedIncome(profile.incomeRange || '');
    setJobTitle(profile.jobTitle === 'Not specified' ? '' : profile.jobTitle || '');
    setJobIndustry(profile.jobIndustry === 'Not specified' ? '' : profile.jobIndustry || '');
    setSelectedInterests(profile.interests || []);
    setIsMarried(profile.isMarried);
    setHasChildren(profile.hasChildren);
    setChildrenCount(profile.childrenCount || '');
    setCaresForElderly(profile.caresForElderly);
    setElderlyAreDependent(profile.elderlyAreDependent);
  }, []);

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

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

  const handleSave = async () => {
    // Validation
    if (!zipCode.trim()) {
      Alert.alert('Required Field', 'Please enter your zip code');
      return;
    }

    if (!validateZipCode(zipCode)) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit zip code');
      return;
    }

    if (!selectedAge || !selectedGender || !selectedIncome) {
      Alert.alert('Required Fields', 'Please fill in all demographic and income information');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Required Field', 'Please select at least one interest');
      return;
    }

    setIsSaving(true);

    try {
      // Save updated profile
      global.userProfile = {
        ...global.userProfile,
        zipCode: zipCode.trim(),
        ageRange: selectedAge,
        gender: selectedGender,
        incomeRange: selectedIncome,
        jobTitle: jobTitle.trim() || 'Not specified',
        jobIndustry: jobIndustry.trim() || 'Not specified',
        interests: selectedInterests,
        isMarried,
        hasChildren,
        childrenCount: hasChildren ? childrenCount : undefined,
        caresForElderly,
        elderlyAreDependent: caresForElderly ? elderlyAreDependent : undefined,
        onboardingComplete: true,
      };

      // Simulate a brief save delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate back to profile page
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        Alert.alert('Success', 'Your profile has been updated successfully!');
      }, 100);

    } catch (error) {
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSelector = (
    title: string,
    options: DemographicOption[],
    selected: string,
    onSelect: (id: string) => void,
    required: boolean = true
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>
        {title} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected === option.id && styles.optionSelected
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Text style={[
              styles.optionText,
              selected === option.id && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBooleanSelector = (
    title: string,
    value: boolean | undefined,
    onSelect: (value: boolean | undefined) => void,
    trueLabel: string = 'Yes',
    falseLabel: string = 'No'
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
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
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>How many children do you have?</Text>
      <View style={styles.optionsContainer}>
        {childrenCounts.map((count) => (
          <TouchableOpacity
            key={count.id}
            style={[
              styles.option,
              childrenCount === count.id && styles.optionSelected
            ]}
            onPress={() => setChildrenCount(count.id)}
          >
            <Text style={[
              styles.optionText,
              childrenCount === count.id && styles.optionTextSelected
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
          disabled={isSaving}
        >
          <ChevronLeft color={isSaving ? "#9CA3AF" : "#6B7280"} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Save color={isSaving ? "#9CA3AF" : "#2563EB"} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin color="#2563EB" size={20} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Zip Code <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, isSaving && styles.inputDisabled]}
                placeholder="Enter your 5-digit zip code"
                placeholderTextColor="#9CA3AF"
                value={zipCode}
                onChangeText={(text) => setZipCode(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={5}
                editable={!isSaving}
              />
            </View>
          </View>

          {/* Demographics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users color="#059669" size={20} />
              <Text style={styles.sectionTitle}>Demographics</Text>
            </View>
            
            {renderSelector('Age Range', ageRanges, selectedAge, setSelectedAge)}
            {renderSelector('Gender', genders, selectedGender, setSelectedGender)}
          </View>

          {/* Income Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign color="#059669" size={20} />
              <Text style={styles.sectionTitle}>Income</Text>
            </View>
            
            {renderSelector('Annual Household Income', incomeRanges, selectedIncome, setSelectedIncome)}
          </View>

          {/* Work Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Briefcase color="#7C3AED" size={20} />
              <Text style={styles.sectionTitle}>Work (Optional)</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Title</Text>
              <TextInput
                style={[styles.textInput, isSaving && styles.inputDisabled]}
                placeholder="e.g., Software Engineer, Teacher, Manager"
                placeholderTextColor="#9CA3AF"
                value={jobTitle}
                onChangeText={setJobTitle}
                editable={!isSaving}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Industry</Text>
              <TextInput
                style={[styles.textInput, isSaving && styles.inputDisabled]}
                placeholder="e.g., Technology, Healthcare, Finance"
                placeholderTextColor="#9CA3AF"
                value={jobIndustry}
                onChangeText={setJobIndustry}
                editable={!isSaving}
              />
            </View>
          </View>

          {/* Family Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Family color="#DC2626" size={20} />
              <Text style={styles.sectionTitle}>Family (Optional)</Text>
            </View>
            
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

          {/* Interests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart color="#DC2626" size={20} />
              <Text style={styles.sectionTitle}>Interests</Text>
            </View>
            
            <Text style={styles.selectorTitle}>
              Topics of Interest ({selectedInterests.length}/3) <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.selectorSubtitle}>Select at least 1 topic you care most about (up to 3)</Text>
            
            <View style={styles.interestsGrid}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest.id) && styles.interestSelected,
                    isSaving && styles.interestDisabled
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                  disabled={isSaving || (selectedInterests.length >= 3 && !selectedInterests.includes(interest.id))}
                >
                  <Text style={styles.interestIcon}>{interest.icon}</Text>
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest.id) && styles.interestTextSelected,
                    isSaving && styles.interestTextDisabled
                  ]}>
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveProfileButton, isSaving && styles.saveProfileButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Save color="#FFFFFF" size={20} />
          <Text style={styles.saveProfileButtonText}>
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
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
  required: {
    color: '#DC2626',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  selectorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  option: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 6,
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#2563EB',
  },
  booleanContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  interestChip: {
    backgroundColor: '#F9FAFB',
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
  interestDisabled: {
    opacity: 0.5,
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
  interestTextDisabled: {
    color: '#9CA3AF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveProfileButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});