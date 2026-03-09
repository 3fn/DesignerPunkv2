import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, MapPin, Briefcase, Heart, CreditCard as Edit, Bell, Users as FamilyIcon, Baby, UserCheck, UserX, DollarSign, Settings, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface UserProfile {
  zipCode?: string;
  ageRange?: string;
  gender?: string;
  jobTitle?: string;
  jobIndustry?: string;
  incomeRange?: string;
  interests?: string[];
  isMarried?: boolean;
  hasChildren?: boolean;
  childrenCount?: string;
  caresForElderly?: boolean;
  elderlyAreDependent?: boolean;
}

interface ProfileCompleteness {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  totalFields: number;
  completedFields: number;
}

const interestLabels: { [key: string]: string } = {
  'healthcare': '🏥 Healthcare',
  'education': '🎓 Education',
  'environment': '🌱 Environment',
  'technology': '💻 Technology',
  'defense': '🛡️ National Defense',
  'economy': '📈 Economy & Trade',
  'immigration': '🌍 Immigration',
  'housing': '🏠 Housing',
  'transportation': '🚗 Transportation',
  'energy': '⚡ Energy',
  'civil-rights': '⚖️ Civil Rights',
  'agriculture': '🌾 Agriculture',
};

const incomeLabels: { [key: string]: string } = {
  'under-25k': 'Under $25,000',
  '25k-80k': '$25,000 - $80,000',
  '80k-200k': '$80,000 - $200,000',
  '200k-350k': '$200,000 - $350,000',
  'over-350k': 'Over $350,000',
};

const childrenLabels: { [key: string]: string } = {
  '1': '1 child',
  '2': '2 children',
  '3': '3 children',
  '4': '4 children',
  '5+': '5+ children',
};

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({});
  const [showSettings, setShowSettings] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState<ProfileCompleteness>({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [],
    totalFields: 0,
    completedFields: 0,
  });

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const userProfile = global.userProfile || {};
      setProfile(userProfile);
      calculateProfileCompleteness(userProfile);
    }, [])
  );

  const calculateProfileCompleteness = (profile: UserProfile) => {
    const requiredFields = [
      { key: 'zipCode', label: 'Location (Zip Code)' },
      { key: 'ageRange', label: 'Age Range' },
      { key: 'gender', label: 'Gender' },
      { key: 'incomeRange', label: 'Income Range' },
      { key: 'interests', label: 'Interests', validator: (value: any) => Array.isArray(value) && value.length > 0 },
    ];

    const optionalFields = [
      { key: 'jobTitle', label: 'Job Title', validator: (value: any) => value && value !== 'Not specified' },
      { key: 'jobIndustry', label: 'Job Industry', validator: (value: any) => value && value !== 'Not specified' },
      { key: 'isMarried', label: 'Marital Status', validator: (value: any) => value !== undefined },
      { key: 'hasChildren', label: 'Children Status', validator: (value: any) => value !== undefined },
      { key: 'caresForElderly', label: 'Elderly Care Status', validator: (value: any) => value !== undefined },
    ];

    const allFields = [...requiredFields, ...optionalFields];
    const missingFields: string[] = [];
    let completedFields = 0;

    // Check required fields
    requiredFields.forEach(field => {
      const value = profile[field.key as keyof UserProfile];
      const isValid = field.validator ? field.validator(value) : value !== undefined && value !== null && value !== '';
      
      if (!isValid) {
        missingFields.push(field.label);
      } else {
        completedFields++;
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const value = profile[field.key as keyof UserProfile];
      const isValid = field.validator ? field.validator(value) : value !== undefined && value !== null && value !== '';
      
      if (isValid) {
        completedFields++;
      } else {
        missingFields.push(field.label);
      }
    });

    const totalFields = allFields.length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    const isComplete = missingFields.length === 0;

    setProfileCompleteness({
      isComplete,
      completionPercentage,
      missingFields,
      totalFields,
      completedFields,
    });
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const getLocationInfo = (zipCode: string) => {
    // Expanded location mapping for various US cities
    const locationMap: { [key: string]: string } = {
      // Portland, OR area
      '97201': 'Portland, OR',
      '97202': 'Portland, OR',
      '97203': 'Portland, OR',
      '97204': 'Portland, OR',
      '97205': 'Portland, OR',
      '97206': 'Portland, OR',
      '97207': 'Portland, OR',
      '97208': 'Portland, OR',
      '97209': 'Portland, OR',
      '97210': 'Portland, OR',
      '97211': 'Portland, OR',
      '97212': 'Portland, OR',
      '97213': 'Portland, OR',
      '97214': 'Portland, OR',
      '97215': 'Portland, OR',
      '97216': 'Portland, OR',
      '97217': 'Portland, OR',
      '97218': 'Portland, OR',
      '97219': 'Portland, OR',
      '97220': 'Portland, OR',
      '97221': 'Portland, OR',
      '97222': 'Portland, OR',
      '97223': 'Portland, OR',
      '97224': 'Portland, OR',
      '97225': 'Portland, OR',
      '97227': 'Portland, OR',
      '97228': 'Portland, OR',
      '97229': 'Portland, OR',
      '97230': 'Portland, OR',
      '97231': 'Portland, OR',
      '97232': 'Portland, OR',
      '97233': 'Portland, OR',
      '97236': 'Portland, OR',
      '97238': 'Portland, OR',
      '97239': 'Portland, OR',
      '97240': 'Portland, OR',
      '97242': 'Portland, OR',
      '97266': 'Portland, OR',
      '97267': 'Portland, OR',
      '97268': 'Portland, OR',
      '97269': 'Portland, OR',
      '97280': 'Portland, OR',
      '97281': 'Portland, OR',
      '97282': 'Portland, OR',
      '97283': 'Portland, OR',
      '97286': 'Portland, OR',
      '97290': 'Portland, OR',
      '97291': 'Portland, OR',
      '97292': 'Portland, OR',
      '97293': 'Portland, OR',
      '97294': 'Portland, OR',
      '97296': 'Portland, OR',
      '97298': 'Portland, OR',
      
      // San Francisco, CA area
      '94102': 'San Francisco, CA',
      '94103': 'San Francisco, CA',
      '94104': 'San Francisco, CA',
      '94105': 'San Francisco, CA',
      '94107': 'San Francisco, CA',
      '94108': 'San Francisco, CA',
      '94109': 'San Francisco, CA',
      '94110': 'San Francisco, CA',
      '94111': 'San Francisco, CA',
      '94112': 'San Francisco, CA',
      '94114': 'San Francisco, CA',
      '94115': 'San Francisco, CA',
      '94116': 'San Francisco, CA',
      '94117': 'San Francisco, CA',
      '94118': 'San Francisco, CA',
      '94121': 'San Francisco, CA',
      '94122': 'San Francisco, CA',
      '94123': 'San Francisco, CA',
      '94124': 'San Francisco, CA',
      '94127': 'San Francisco, CA',
      '94129': 'San Francisco, CA',
      '94130': 'San Francisco, CA',
      '94131': 'San Francisco, CA',
      '94132': 'San Francisco, CA',
      '94133': 'San Francisco, CA',
      '94134': 'San Francisco, CA',
      '94158': 'San Francisco, CA',
      
      // New York, NY area
      '10001': 'New York, NY',
      '10002': 'New York, NY',
      '10003': 'New York, NY',
      '10004': 'New York, NY',
      '10005': 'New York, NY',
      '10006': 'New York, NY',
      '10007': 'New York, NY',
      '10009': 'New York, NY',
      '10010': 'New York, NY',
      '10011': 'New York, NY',
      '10012': 'New York, NY',
      '10013': 'New York, NY',
      '10014': 'New York, NY',
      '10016': 'New York, NY',
      '10017': 'New York, NY',
      '10018': 'New York, NY',
      '10019': 'New York, NY',
      '10020': 'New York, NY',
      '10021': 'New York, NY',
      '10022': 'New York, NY',
      '10023': 'New York, NY',
      '10024': 'New York, NY',
      '10025': 'New York, NY',
      '10026': 'New York, NY',
      '10027': 'New York, NY',
      '10028': 'New York, NY',
      '10029': 'New York, NY',
      '10030': 'New York, NY',
      '10031': 'New York, NY',
      '10032': 'New York, NY',
      '10033': 'New York, NY',
      '10034': 'New York, NY',
      '10035': 'New York, NY',
      '10036': 'New York, NY',
      '10037': 'New York, NY',
      '10038': 'New York, NY',
      '10039': 'New York, NY',
      '10040': 'New York, NY',
      
      // Los Angeles, CA area
      '90001': 'Los Angeles, CA',
      '90002': 'Los Angeles, CA',
      '90003': 'Los Angeles, CA',
      '90004': 'Los Angeles, CA',
      '90005': 'Los Angeles, CA',
      '90006': 'Los Angeles, CA',
      '90007': 'Los Angeles, CA',
      '90008': 'Los Angeles, CA',
      '90010': 'Los Angeles, CA',
      '90011': 'Los Angeles, CA',
      '90012': 'Los Angeles, CA',
      '90013': 'Los Angeles, CA',
      '90014': 'Los Angeles, CA',
      '90015': 'Los Angeles, CA',
      '90016': 'Los Angeles, CA',
      '90017': 'Los Angeles, CA',
      '90018': 'Los Angeles, CA',
      '90019': 'Los Angeles, CA',
      '90020': 'Los Angeles, CA',
      '90021': 'Los Angeles, CA',
      '90022': 'Los Angeles, CA',
      '90023': 'Los Angeles, CA',
      '90024': 'Los Angeles, CA',
      '90025': 'Los Angeles, CA',
      '90026': 'Los Angeles, CA',
      '90027': 'Los Angeles, CA',
      '90028': 'Los Angeles, CA',
      '90029': 'Los Angeles, CA',
      '90031': 'Los Angeles, CA',
      '90032': 'Los Angeles, CA',
      '90033': 'Los Angeles, CA',
      '90034': 'Los Angeles, CA',
      '90035': 'Los Angeles, CA',
      '90036': 'Los Angeles, CA',
      '90037': 'Los Angeles, CA',
      '90038': 'Los Angeles, CA',
      '90039': 'Los Angeles, CA',
      '90040': 'Los Angeles, CA',
      '90041': 'Los Angeles, CA',
      '90042': 'Los Angeles, CA',
      '90043': 'Los Angeles, CA',
      '90044': 'Los Angeles, CA',
      '90045': 'Los Angeles, CA',
      '90046': 'Los Angeles, CA',
      '90047': 'Los Angeles, CA',
      '90048': 'Los Angeles, CA',
      '90049': 'Los Angeles, CA',
      '90056': 'Los Angeles, CA',
      '90057': 'Los Angeles, CA',
      '90058': 'Los Angeles, CA',
      '90059': 'Los Angeles, CA',
      '90061': 'Los Angeles, CA',
      '90062': 'Los Angeles, CA',
      '90063': 'Los Angeles, CA',
      '90064': 'Los Angeles, CA',
      '90065': 'Los Angeles, CA',
      '90066': 'Los Angeles, CA',
      '90067': 'Los Angeles, CA',
      '90068': 'Los Angeles, CA',
      '90069': 'Los Angeles, CA',
      '90071': 'Los Angeles, CA',
      '90077': 'Los Angeles, CA',
      '90089': 'Los Angeles, CA',
      '90094': 'Los Angeles, CA',
      '90095': 'Los Angeles, CA',
      '90210': 'Beverly Hills, CA',
      '90211': 'Beverly Hills, CA',
      '90212': 'Beverly Hills, CA',
      
      // Chicago, IL area
      '60601': 'Chicago, IL',
      '60602': 'Chicago, IL',
      '60603': 'Chicago, IL',
      '60604': 'Chicago, IL',
      '60605': 'Chicago, IL',
      '60606': 'Chicago, IL',
      '60607': 'Chicago, IL',
      '60608': 'Chicago, IL',
      '60609': 'Chicago, IL',
      '60610': 'Chicago, IL',
      '60611': 'Chicago, IL',
      '60612': 'Chicago, IL',
      '60613': 'Chicago, IL',
      '60614': 'Chicago, IL',
      '60615': 'Chicago, IL',
      '60616': 'Chicago, IL',
      '60617': 'Chicago, IL',
      '60618': 'Chicago, IL',
      '60619': 'Chicago, IL',
      '60620': 'Chicago, IL',
      '60621': 'Chicago, IL',
      '60622': 'Chicago, IL',
      '60623': 'Chicago, IL',
      '60624': 'Chicago, IL',
      '60625': 'Chicago, IL',
      '60626': 'Chicago, IL',
      '60628': 'Chicago, IL',
      '60629': 'Chicago, IL',
      '60630': 'Chicago, IL',
      '60631': 'Chicago, IL',
      '60632': 'Chicago, IL',
      '60633': 'Chicago, IL',
      '60634': 'Chicago, IL',
      '60636': 'Chicago, IL',
      '60637': 'Chicago, IL',
      '60638': 'Chicago, IL',
      '60639': 'Chicago, IL',
      '60640': 'Chicago, IL',
      '60641': 'Chicago, IL',
      '60642': 'Chicago, IL',
      '60643': 'Chicago, IL',
      '60644': 'Chicago, IL',
      '60645': 'Chicago, IL',
      '60646': 'Chicago, IL',
      '60647': 'Chicago, IL',
      '60649': 'Chicago, IL',
      '60651': 'Chicago, IL',
      '60652': 'Chicago, IL',
      '60653': 'Chicago, IL',
      '60654': 'Chicago, IL',
      '60655': 'Chicago, IL',
      '60656': 'Chicago, IL',
      '60657': 'Chicago, IL',
      '60659': 'Chicago, IL',
      '60660': 'Chicago, IL',
      '60661': 'Chicago, IL',
      '60664': 'Chicago, IL',
      '60666': 'Chicago, IL',
      '60668': 'Chicago, IL',
      '60669': 'Chicago, IL',
      '60670': 'Chicago, IL',
      '60673': 'Chicago, IL',
      '60674': 'Chicago, IL',
      '60675': 'Chicago, IL',
      '60677': 'Chicago, IL',
      '60678': 'Chicago, IL',
      '60680': 'Chicago, IL',
      '60681': 'Chicago, IL',
      '60682': 'Chicago, IL',
      '60684': 'Chicago, IL',
      '60685': 'Chicago, IL',
      '60686': 'Chicago, IL',
      '60687': 'Chicago, IL',
      '60688': 'Chicago, IL',
      '60689': 'Chicago, IL',
      '60690': 'Chicago, IL',
      '60691': 'Chicago, IL',
      '60693': 'Chicago, IL',
      '60694': 'Chicago, IL',
      '60695': 'Chicago, IL',
      '60696': 'Chicago, IL',
      '60697': 'Chicago, IL',
      '60699': 'Chicago, IL',
      
      // Washington, DC area
      '20001': 'Washington, DC',
      '20002': 'Washington, DC',
      '20003': 'Washington, DC',
      '20004': 'Washington, DC',
      '20005': 'Washington, DC',
      '20006': 'Washington, DC',
      '20007': 'Washington, DC',
      '20008': 'Washington, DC',
      '20009': 'Washington, DC',
      '20010': 'Washington, DC',
      '20011': 'Washington, DC',
      '20012': 'Washington, DC',
      '20015': 'Washington, DC',
      '20016': 'Washington, DC',
      '20017': 'Washington, DC',
      '20018': 'Washington, DC',
      '20019': 'Washington, DC',
      '20020': 'Washington, DC',
      '20024': 'Washington, DC',
      '20032': 'Washington, DC',
      '20036': 'Washington, DC',
      '20037': 'Washington, DC',
      '20052': 'Washington, DC',
      '20053': 'Washington, DC',
      '20057': 'Washington, DC',
      '20064': 'Washington, DC',
      '20202': 'Washington, DC',
      '20204': 'Washington, DC',
      '20228': 'Washington, DC',
      '20230': 'Washington, DC',
      '20240': 'Washington, DC',
      '20245': 'Washington, DC',
      '20250': 'Washington, DC',
      '20260': 'Washington, DC',
      '20307': 'Washington, DC',
      '20317': 'Washington, DC',
      '20319': 'Washington, DC',
      '20373': 'Washington, DC',
      '20390': 'Washington, DC',
      '20405': 'Washington, DC',
      '20418': 'Washington, DC',
      '20427': 'Washington, DC',
      '20506': 'Washington, DC',
      '20510': 'Washington, DC',
      '20515': 'Washington, DC',
      '20520': 'Washington, DC',
      '20535': 'Washington, DC',
      '20540': 'Washington, DC',
      '20551': 'Washington, DC',
      '20553': 'Washington, DC',
      '20560': 'Washington, DC',
      '20565': 'Washington, DC',
      '20566': 'Washington, DC',
      '20593': 'Washington, DC',
    };
    return locationMap[zipCode] || 'Unknown Location';
  };

  const getCongressionalInfo = (zipCode: string) => {
    // Expanded congressional district mapping
    const districtMap: { [key: string]: string } = {
      // Portland, OR area districts
      '97201': 'Congressional District 1 • Oregon State Senate District 11',
      '97202': 'Congressional District 1 • Oregon State Senate District 11',
      '97203': 'Congressional District 1 • Oregon State Senate District 13',
      '97204': 'Congressional District 1 • Oregon State Senate District 11',
      '97205': 'Congressional District 1 • Oregon State Senate District 11',
      '97206': 'Congressional District 3 • Oregon State Senate District 21',
      '97207': 'Congressional District 3 • Oregon State Senate District 13',
      '97208': 'Congressional District 1 • Oregon State Senate District 11',
      '97209': 'Congressional District 1 • Oregon State Senate District 11',
      '97210': 'Congressional District 1 • Oregon State Senate District 11',
      '97211': 'Congressional District 3 • Oregon State Senate District 15',
      '97212': 'Congressional District 3 • Oregon State Senate District 15',
      '97213': 'Congressional District 3 • Oregon State Senate District 21',
      '97214': 'Congressional District 3 • Oregon State Senate District 21',
      '97215': 'Congressional District 3 • Oregon State Senate District 21',
      '97216': 'Congressional District 3 • Oregon State Senate District 21',
      '97217': 'Congressional District 3 • Oregon State Senate District 15',
      '97218': 'Congressional District 3 • Oregon State Senate District 15',
      '97219': 'Congressional District 1 • Oregon State Senate District 19',
      '97220': 'Congressional District 3 • Oregon State Senate District 21',
      '97221': 'Congressional District 1 • Oregon State Senate District 13',
      '97222': 'Congressional District 5 • Oregon State Senate District 19',
      '97223': 'Congressional District 1 • Oregon State Senate District 13',
      '97224': 'Congressional District 1 • Oregon State Senate District 13',
      '97225': 'Congressional District 1 • Oregon State Senate District 13',
      '97227': 'Congressional District 3 • Oregon State Senate District 15',
      '97228': 'Congressional District 3 • Oregon State Senate District 15',
      '97229': 'Congressional District 1 • Oregon State Senate District 13',
      '97230': 'Congressional District 3 • Oregon State Senate District 21',
      '97231': 'Congressional District 3 • Oregon State Senate District 15',
      '97232': 'Congressional District 3 • Oregon State Senate District 21',
      '97233': 'Congressional District 3 • Oregon State Senate District 21',
      '97236': 'Congressional District 3 • Oregon State Senate District 21',
      '97238': 'Congressional District 3 • Oregon State Senate District 21',
      '97239': 'Congressional District 1 • Oregon State Senate District 11',
      '97266': 'Congressional District 3 • Oregon State Senate District 21',
      '97267': 'Congressional District 5 • Oregon State Senate District 19',
      '97268': 'Congressional District 5 • Oregon State Senate District 19',
      
      // San Francisco, CA area districts
      '94102': 'Congressional District 11 • California State Senate District 11',
      '94103': 'Congressional District 11 • California State Senate District 11',
      '94104': 'Congressional District 11 • California State Senate District 11',
      '94105': 'Congressional District 11 • California State Senate District 11',
      '94107': 'Congressional District 11 • California State Senate District 11',
      '94108': 'Congressional District 11 • California State Senate District 11',
      '94109': 'Congressional District 11 • California State Senate District 11',
      '94110': 'Congressional District 11 • California State Senate District 11',
      '94111': 'Congressional District 11 • California State Senate District 11',
      '94112': 'Congressional District 11 • California State Senate District 11',
      '94114': 'Congressional District 11 • California State Senate District 11',
      '94115': 'Congressional District 11 • California State Senate District 11',
      '94116': 'Congressional District 11 • California State Senate District 11',
      '94117': 'Congressional District 11 • California State Senate District 11',
      '94118': 'Congressional District 11 • California State Senate District 11',
      '94121': 'Congressional District 11 • California State Senate District 11',
      '94122': 'Congressional District 11 • California State Senate District 11',
      '94123': 'Congressional District 11 • California State Senate District 11',
      '94124': 'Congressional District 11 • California State Senate District 11',
      '94127': 'Congressional District 11 • California State Senate District 11',
      '94129': 'Congressional District 11 • California State Senate District 11',
      '94130': 'Congressional District 11 • California State Senate District 11',
      '94131': 'Congressional District 11 • California State Senate District 11',
      '94132': 'Congressional District 11 • California State Senate District 11',
      '94133': 'Congressional District 11 • California State Senate District 11',
      '94134': 'Congressional District 11 • California State Senate District 11',
      '94158': 'Congressional District 11 • California State Senate District 11',
      
      // New York, NY area districts
      '10001': 'Congressional District 10 • New York State Senate District 27',
      '10002': 'Congressional District 10 • New York State Senate District 26',
      '10003': 'Congressional District 10 • New York State Senate District 27',
      '10004': 'Congressional District 10 • New York State Senate District 26',
      '10005': 'Congressional District 10 • New York State Senate District 26',
      '10006': 'Congressional District 10 • New York State Senate District 26',
      '10007': 'Congressional District 10 • New York State Senate District 26',
      '10009': 'Congressional District 10 • New York State Senate District 26',
      '10010': 'Congressional District 10 • New York State Senate District 27',
      '10011': 'Congressional District 10 • New York State Senate District 27',
      '10012': 'Congressional District 10 • New York State Senate District 26',
      '10013': 'Congressional District 10 • New York State Senate District 26',
      '10014': 'Congressional District 10 • New York State Senate District 27',
      '10016': 'Congressional District 12 • New York State Senate District 27',
      '10017': 'Congressional District 12 • New York State Senate District 27',
      '10018': 'Congressional District 12 • New York State Senate District 27',
      '10019': 'Congressional District 12 • New York State Senate District 27',
      '10020': 'Congressional District 12 • New York State Senate District 27',
      '10021': 'Congressional District 12 • New York State Senate District 28',
      '10022': 'Congressional District 12 • New York State Senate District 27',
      '10023': 'Congressional District 12 • New York State Senate District 30',
      '10024': 'Congressional District 12 • New York State Senate District 30',
      '10025': 'Congressional District 12 • New York State Senate District 30',
      
      // Los Angeles, CA area districts
      '90001': 'Congressional District 44 • California State Senate District 35',
      '90002': 'Congressional District 44 • California State Senate District 35',
      '90003': 'Congressional District 37 • California State Senate District 35',
      '90004': 'Congressional District 34 • California State Senate District 24',
      '90005': 'Congressional District 34 • California State Senate District 24',
      '90006': 'Congressional District 34 • California State Senate District 24',
      '90007': 'Congressional District 37 • California State Senate District 35',
      '90008': 'Congressional District 37 • California State Senate District 35',
      '90010': 'Congressional District 34 • California State Senate District 24',
      '90011': 'Congressional District 44 • California State Senate District 24',
      '90012': 'Congressional District 34 • California State Senate District 22',
      '90013': 'Congressional District 34 • California State Senate District 22',
      '90014': 'Congressional District 34 • California State Senate District 22',
      '90015': 'Congressional District 34 • California State Senate District 22',
      '90016': 'Congressional District 37 • California State Senate District 35',
      '90017': 'Congressional District 34 • California State Senate District 22',
      '90018': 'Congressional District 37 • California State Senate District 35',
      '90019': 'Congressional District 37 • California State Senate District 35',
      '90020': 'Congressional District 34 • California State Senate District 24',
      '90210': 'Congressional District 30 • California State Senate District 26',
      '90211': 'Congressional District 30 • California State Senate District 26',
      '90212': 'Congressional District 30 • California State Senate District 26',
      
      // Chicago, IL area districts
      '60601': 'Congressional District 7 • Illinois State Senate District 3',
      '60602': 'Congressional District 7 • Illinois State Senate District 3',
      '60603': 'Congressional District 7 • Illinois State Senate District 3',
      '60604': 'Congressional District 7 • Illinois State Senate District 3',
      '60605': 'Congressional District 7 • Illinois State Senate District 3',
      '60606': 'Congressional District 7 • Illinois State Senate District 3',
      '60607': 'Congressional District 7 • Illinois State Senate District 3',
      '60608': 'Congressional District 7 • Illinois State Senate District 3',
      '60609': 'Congressional District 7 • Illinois State Senate District 3',
      '60610': 'Congressional District 5 • Illinois State Senate District 3',
      '60611': 'Congressional District 5 • Illinois State Senate District 3',
      '60612': 'Congressional District 7 • Illinois State Senate District 3',
      '60613': 'Congressional District 5 • Illinois State Senate District 11',
      '60614': 'Congressional District 5 • Illinois State Senate District 3',
      '60615': 'Congressional District 1 • Illinois State Senate District 13',
      '60616': 'Congressional District 7 • Illinois State Senate District 3',
      '60617': 'Congressional District 2 • Illinois State Senate District 13',
      '60618': 'Congressional District 5 • Illinois State Senate District 11',
      '60619': 'Congressional District 1 • Illinois State Senate District 15',
      '60620': 'Congressional District 1 • Illinois State Senate District 15',
      
      // Washington, DC area districts
      '20001': 'Congressional District (At-Large) • DC Council Ward 6',
      '20002': 'Congressional District (At-Large) • DC Council Ward 6',
      '20003': 'Congressional District (At-Large) • DC Council Ward 6',
      '20004': 'Congressional District (At-Large) • DC Council Ward 6',
      '20005': 'Congressional District (At-Large) • DC Council Ward 2',
      '20006': 'Congressional District (At-Large) • DC Council Ward 2',
      '20007': 'Congressional District (At-Large) • DC Council Ward 2',
      '20008': 'Congressional District (At-Large) • DC Council Ward 3',
      '20009': 'Congressional District (At-Large) • DC Council Ward 1',
      '20010': 'Congressional District (At-Large) • DC Council Ward 1',
      '20011': 'Congressional District (At-Large) • DC Council Ward 4',
      '20012': 'Congressional District (At-Large) • DC Council Ward 4',
      '20015': 'Congressional District (At-Large) • DC Council Ward 3',
      '20016': 'Congressional District (At-Large) • DC Council Ward 3',
      '20017': 'Congressional District (At-Large) • DC Council Ward 5',
      '20018': 'Congressional District (At-Large) • DC Council Ward 5',
      '20019': 'Congressional District (At-Large) • DC Council Ward 7',
      '20020': 'Congressional District (At-Large) • DC Council Ward 8',
    };
    return districtMap[zipCode] || 'District information not available';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Settings color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User color="#FFFFFF" size={32} />
          </View>
          <Text style={styles.profileName}>Your Civic Profile</Text>
          <Text style={styles.profileSubtitle}>Personalized for your location and interests</Text>
        </View>

        {/* Profile Completeness Section */}
        {!profileCompleteness.isComplete && (
          <View style={styles.completenessCard}>
            <View style={styles.completenessHeader}>
              <View style={styles.completenessIconContainer}>
                <AlertCircle color="#F59E0B" size={20} />
              </View>
              <View style={styles.completenessContent}>
                <Text style={styles.completenessTitle}>Complete Your Profile</Text>
                <Text style={styles.completenessSubtitle}>
                  {profileCompleteness.completionPercentage}% complete • Get better personalized insights
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${profileCompleteness.completionPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {profileCompleteness.completedFields} of {profileCompleteness.totalFields} fields
              </Text>
            </View>

            {profileCompleteness.missingFields.length > 0 && (
              <View style={styles.missingFieldsContainer}>
                <Text style={styles.missingFieldsTitle}>Missing Information:</Text>
                <View style={styles.missingFieldsList}>
                  {profileCompleteness.missingFields.slice(0, 3).map((field, index) => (
                    <View key={index} style={styles.missingFieldItem}>
                      <View style={styles.missingFieldDot} />
                      <Text style={styles.missingFieldText}>{field}</Text>
                    </View>
                  ))}
                  {profileCompleteness.missingFields.length > 3 && (
                    <Text style={styles.moreFieldsText}>
                      +{profileCompleteness.missingFields.length - 3} more
                    </Text>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.completeProfileButton} onPress={handleEditProfile}>
              <Text style={styles.completeProfileButtonText}>Complete Profile</Text>
              <ArrowRight color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Complete Badge */}
        {profileCompleteness.isComplete && (
          <View style={styles.completeCard}>
            <View style={styles.completeHeader}>
              <CheckCircle color="#059669" size={24} />
              <View style={styles.completeContent}>
                <Text style={styles.completeTitle}>Profile Complete!</Text>
                <Text style={styles.completeSubtitle}>
                  You're getting the most personalized experience possible
                </Text>
              </View>
            </View>
          </View>
        )}

        {profile.zipCode && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <MapPin color="#2563EB" size={20} />
              <Text style={styles.cardTitle}>Location</Text>
            </View>
            <Text style={styles.infoText}>Zip Code: {profile.zipCode}</Text>
            <Text style={styles.infoSubtext}>{getLocationInfo(profile.zipCode)}</Text>
            <Text style={styles.infoDetail}>
              {getCongressionalInfo(profile.zipCode)}
            </Text>
          </View>
        )}

        {(profile.ageRange || profile.gender) && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <User color="#059669" size={20} />
              <Text style={styles.cardTitle}>Demographics</Text>
            </View>
            <View style={styles.infoGrid}>
              {profile.ageRange && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age Range</Text>
                  <Text style={styles.infoValue}>{profile.ageRange}</Text>
                </View>
              )}
              {profile.gender && profile.gender !== 'prefer-not-to-say' && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>
                    {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {profile.incomeRange && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <DollarSign color="#059669" size={20} />
              <Text style={styles.cardTitle}>Income</Text>
            </View>
            <Text style={styles.infoText}>
              Annual Household Income: {incomeLabels[profile.incomeRange] || profile.incomeRange}
            </Text>
          </View>
        )}

        {(profile.jobTitle || profile.jobIndustry) && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Briefcase color="#7C3AED" size={20} />
              <Text style={styles.cardTitle}>Work</Text>
            </View>
            {profile.jobTitle && profile.jobTitle !== 'Not specified' && (
              <Text style={styles.infoText}>{profile.jobTitle}</Text>
            )}
            {profile.jobIndustry && profile.jobIndustry !== 'Not specified' && (
              <Text style={styles.infoSubtext}>{profile.jobIndustry} Industry</Text>
            )}
          </View>
        )}

        {/* Family Section */}
        {(profile.isMarried !== undefined || profile.hasChildren !== undefined || profile.caresForElderly !== undefined) && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <FamilyIcon color="#DC2626" size={20} />
              <Text style={styles.cardTitle}>Family</Text>
            </View>
            <View style={styles.familyGrid}>
              {profile.isMarried !== undefined && (
                <View style={styles.familyItem}>
                  <View style={styles.familyIconContainer}>
                    {profile.isMarried ? (
                      <UserCheck color="#059669" size={16} />
                    ) : (
                      <UserX color="#6B7280" size={16} />
                    )}
                  </View>
                  <View style={styles.familyContent}>
                    <Text style={styles.familyLabel}>Marital Status</Text>
                    <Text style={styles.familyValue}>
                      {profile.isMarried ? 'Married/Civil Union' : 'Single'}
                    </Text>
                  </View>
                </View>
              )}
              
              {profile.hasChildren !== undefined && (
                <View style={styles.familyItem}>
                  <View style={styles.familyIconContainer}>
                    <Baby color={profile.hasChildren ? "#059669" : "#6B7280"} size={16} />
                  </View>
                  <View style={styles.familyContent}>
                    <Text style={styles.familyLabel}>Children</Text>
                    <Text style={styles.familyValue}>
                      {profile.hasChildren 
                        ? (profile.childrenCount ? childrenLabels[profile.childrenCount] || `${profile.childrenCount} children` : 'Has children')
                        : 'No children'
                      }
                    </Text>
                  </View>
                </View>
              )}
              
              {profile.caresForElderly !== undefined && (
                <View style={styles.familyItem}>
                  <View style={styles.familyIconContainer}>
                    <Heart color={profile.caresForElderly ? "#059669" : "#6B7280"} size={16} />
                  </View>
                  <View style={styles.familyContent}>
                    <Text style={styles.familyLabel}>Elderly Care</Text>
                    <Text style={styles.familyValue}>
                      {profile.caresForElderly 
                        ? (profile.elderlyAreDependent ? 'Cares for elderly dependents' : 'Cares for elderly parents')
                        : 'No elderly care responsibilities'
                      }
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Heart color="#DC2626" size={20} />
              <Text style={styles.cardTitle}>Interests</Text>
            </View>
            <View style={styles.interestTags}>
              {profile.interests.map((interest) => (
                <View key={interest} style={styles.interestTag}>
                  <Text style={styles.interestTagText}>
                    {interestLabels[interest] || interest}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings Section - Collapsible */}
        {showSettings && (
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Bell color="#6B7280" size={20} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Manage alert preferences</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <Edit color="#6B7280" size={20} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Edit Profile</Text>
                <Text style={styles.settingSubtitle}>Update your information</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.impactSummary}>
          <Text style={styles.summaryTitle}>Your Impact Summary</Text>
          <Text style={styles.summaryDescription}>
            Based on your profile, we're tracking 8 bills that may directly affect you. 
            2 have high impact potential for your demographic and income level.
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#2563EB',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  completenessCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  completenessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completenessIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  completenessContent: {
    flex: 1,
  },
  completenessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  completenessSubtitle: {
    fontSize: 14,
    color: '#B45309',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#FDE68A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  missingFieldsContainer: {
    marginBottom: 16,
  },
  missingFieldsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
    marginBottom: 8,
  },
  missingFieldsList: {
    gap: 4,
  },
  missingFieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missingFieldDot: {
    width: 4,
    height: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginRight: 8,
  },
  missingFieldText: {
    fontSize: 13,
    color: '#B45309',
  },
  moreFieldsText: {
    fontSize: 13,
    color: '#92400E',
    fontStyle: 'italic',
    marginLeft: 12,
  },
  completeProfileButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  completeProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completeCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  completeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeContent: {
    marginLeft: 12,
  },
  completeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 2,
  },
  completeSubtitle: {
    fontSize: 14,
    color: '#047857',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  infoDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  familyGrid: {
    gap: 16,
  },
  familyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  familyContent: {
    flex: 1,
  },
  familyLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  familyValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestTagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  impactSummary: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});