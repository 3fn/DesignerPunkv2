import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Linking } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Users, Phone, Mail, Globe, MapPin, Calendar, Award, ExternalLink } from 'lucide-react-native';
import { useRepresentatives } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage, InlineError } from '@/components/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Representative } from '@/types/api';

function RepresentativeCard({ representative }: { representative: Representative }) {
  const handleContact = useCallback((type: 'phone' | 'email' | 'website', value: string) => {
    let url = '';
    switch (type) {
      case 'phone':
        url = `tel:${value}`;
        break;
      case 'email':
        url = `mailto:${value}`;
        break;
      case 'website':
        url = value.startsWith('http') ? value : `https://${value}`;
        break;
    }
    
    if (url) {
      Linking.openURL(url).catch(err => {
        console.warn('Failed to open URL:', err);
      });
    }
  }, []);

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'republican':
      case 'r':
        return '#DC2626';
      case 'democrat':
      case 'democratic':
      case 'd':
        return '#2563EB';
      case 'independent':
      case 'i':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const getPartyBackground = (party: string) => {
    switch (party.toLowerCase()) {
      case 'republican':
      case 'r':
        return '#FEF2F2';
      case 'democrat':
      case 'democratic':
      case 'd':
        return '#EFF6FF';
      case 'independent':
      case 'i':
        return '#ECFDF5';
      default:
        return '#F3F4F6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.repCard}>
      <View style={styles.repHeader}>
        <View style={styles.repInfo}>
          {representative.photo && (
            <Image 
              source={{ uri: representative.photo }} 
              style={styles.repPhoto}
              defaultSource={require('@/assets/images/icon.png')}
            />
          )}
          <View style={styles.repDetails}>
            <Text style={styles.repName}>{representative.name}</Text>
            <Text style={styles.repTitle}>{representative.title}</Text>
            <View style={[
              styles.partyBadge,
              { backgroundColor: getPartyBackground(representative.party) }
            ]}>
              <Text style={[
                styles.partyText,
                { color: getPartyColor(representative.party) }
              ]}>
                {representative.party}
              </Text>
            </View>
          </View>
        </View>
        
        {representative.leadership && (
          <View style={styles.leadershipBadge}>
            <Award color="#F59E0B" size={16} />
            <Text style={styles.leadershipText}>{representative.leadership}</Text>
          </View>
        )}
      </View>

      <View style={styles.repLocation}>
        <MapPin color="#6B7280" size={16} />
        <Text style={styles.locationText}>
          {representative.state}
          {representative.district && ` - District ${representative.district}`}
        </Text>
      </View>

      {representative.committees.length > 0 && (
        <View style={styles.committeesSection}>
          <Text style={styles.committeesTitle}>Committees</Text>
          <View style={styles.committeeTags}>
            {representative.committees.slice(0, 3).map((committee, index) => (
              <View key={index} style={styles.committeeTag}>
                <Text style={styles.committeeTagText}>{committee}</Text>
              </View>
            ))}
            {representative.committees.length > 3 && (
              <Text style={styles.moreCommittees}>
                +{representative.committees.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.termInfo}>
        <View style={styles.termItem}>
          <Calendar color="#6B7280" size={16} />
          <Text style={styles.termText}>
            Term: {formatDate(representative.termStart)} - {formatDate(representative.termEnd)}
          </Text>
        </View>
        <Text style={styles.nextElection}>
          Next Election: {formatDate(representative.nextElection)}
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Contact Information</Text>
        
        <View style={styles.contactMethods}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleContact('phone', representative.phone)}
          >
            <Phone color="#2563EB" size={18} />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
          
          {representative.email && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact('email', representative.email)}
            >
              <Mail color="#2563EB" size={18} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleContact('website', representative.website)}
          >
            <Globe color="#2563EB" size={18} />
            <Text style={styles.contactButtonText}>Website</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.officeInfo}>
          <Text style={styles.officeLabel}>Office:</Text>
          <Text style={styles.officeText}>{representative.office}</Text>
        </View>
        
        <View style={styles.phoneInfo}>
          <Text style={styles.phoneLabel}>Phone:</Text>
          <Text style={styles.phoneText}>{representative.phone}</Text>
        </View>
      </View>

      {representative.socialMedia && Object.keys(representative.socialMedia).length > 0 && (
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Social Media</Text>
          <View style={styles.socialLinks}>
            {representative.socialMedia.twitter && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContact('website', `https://twitter.com/${representative.socialMedia.twitter}`)}
              >
                <Text style={styles.socialButtonText}>Twitter</Text>
                <ExternalLink color="#6B7280" size={14} />
              </TouchableOpacity>
            )}
            {representative.socialMedia.facebook && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleContact('website', `https://facebook.com/${representative.socialMedia.facebook}`)}
              >
                <Text style={styles.socialButtonText}>Facebook</Text>
                <ExternalLink color="#6B7280" size={14} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function RepresentativesContent() {
  const [refreshing, setRefreshing] = useState(false);
  const [userZipCode, setUserZipCode] = useState('');

  useEffect(() => {
    const profile = global.userProfile;
    if (profile?.zipCode) {
      setUserZipCode(profile.zipCode);
    }
  }, []);

  const { data: repsResponse, loading, error, refetch } = useRepresentatives(userZipCode);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (!userZipCode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Representatives</Text>
        </View>
        
        <View style={styles.noLocationContainer}>
          <MapPin color="#9CA3AF" size={48} />
          <Text style={styles.noLocationTitle}>Location Required</Text>
          <Text style={styles.noLocationText}>
            Please complete your profile with your zip code to see your representatives.
          </Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => {/* Navigate to profile */}}
          >
            <Text style={styles.profileButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && !repsResponse) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Representatives</Text>
        </View>
        <LoadingSpinner message="Loading your representatives..." />
      </View>
    );
  }

  if (error && !repsResponse) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Representatives</Text>
        </View>
        <ErrorMessage 
          error={error} 
          onRetry={refetch}
          type={error.includes('network') ? 'network' : 'api'}
        />
      </View>
    );
  }

  const representatives = repsResponse?.data || [];
  const federalReps = representatives.filter(rep => rep.chamber === 'house' || rep.chamber === 'senate');
  const senators = federalReps.filter(rep => rep.chamber === 'senate');
  const houseReps = federalReps.filter(rep => rep.chamber === 'house');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Representatives</Text>
        <Text style={styles.headerSubtitle}>Zip Code: {userZipCode}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && (
          <InlineError error={error} onRetry={refetch} />
        )}

        {representatives.length === 0 ? (
          <View style={styles.emptyState}>
            <Users color="#9CA3AF" size={48} />
            <Text style={styles.emptyStateTitle}>No Representatives Found</Text>
            <Text style={styles.emptyStateText}>
              We couldn't find representatives for your location. Please check your zip code.
            </Text>
          </View>
        ) : (
          <>
            {senators.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>U.S. Senators</Text>
                {senators.map((rep) => (
                  <RepresentativeCard key={rep.id} representative={rep} />
                ))}
              </View>
            )}

            {houseReps.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>U.S. House Representative</Text>
                {houseReps.map((rep) => (
                  <RepresentativeCard key={rep.id} representative={rep} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default function Representatives() {
  return (
    <ErrorBoundary>
      <RepresentativesContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  repCard: {
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
  repHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  repInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  repPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  repDetails: {
    flex: 1,
  },
  repName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  repTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  partyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leadershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  leadershipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D97706',
  },
  repLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  committeesSection: {
    marginBottom: 16,
  },
  committeesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  committeeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  committeeTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  committeeTagText: {
    fontSize: 12,
    color: '#374151',
  },
  moreCommittees: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  termInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  termText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  nextElection: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 24,
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactMethods: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  officeInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  officeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 60,
  },
  officeText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  phoneInfo: {
    flexDirection: 'row',
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    width: 60,
  },
  phoneText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  socialSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  socialButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noLocationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noLocationText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  profileButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});