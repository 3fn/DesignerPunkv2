import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Bell, TrendingUp, CircleAlert as AlertCircle, Users } from 'lucide-react-native';
import { usePersonalizedBills } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { LoadingSpinner, LoadingBillCard } from '@/components/LoadingSpinner';
import { ErrorMessage, InlineError } from '@/components/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Bill } from '@/types/api';

function BillCard({ bill, onPress }: { bill: Bill; onPress: () => void }) {
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return '#DC2626';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getImpactBackground = (level: string) => {
    switch (level) {
      case 'high': return '#FEF2F2';
      case 'medium': return '#FEF3C7';
      case 'low': return '#ECFDF5';
      default: return '#F3F4F6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  return (
    <TouchableOpacity style={styles.legislationCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.impactBadge,
          { backgroundColor: getImpactBackground(bill.impactLevel) }
        ]}>
          <AlertCircle color={getImpactColor(bill.impactLevel)} size={16} />
          <Text style={[
            styles.impactText,
            { color: getImpactColor(bill.impactLevel) }
          ]}>
            {bill.impactLevel.charAt(0).toUpperCase() + bill.impactLevel.slice(1)} Impact
          </Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {bill.level.charAt(0).toUpperCase() + bill.level.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{bill.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>
        {bill.summary}
      </Text>
      
      {bill.personalImpact && (
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Personal Impact</Text>
          {bill.personalImpact.reasons.slice(0, 2).map((reason, index) => (
            <View key={index} style={styles.impactItem}>
              <TrendingUp color="#059669" size={16} />
              <Text style={styles.impactDescription}>{reason}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          Updated {formatDate(bill.lastActionDate)}
        </Text>
        <Text style={styles.readMoreLink}>Read Full Analysis →</Text>
      </View>
    </TouchableOpacity>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get user profile
  const userProfile = global.userProfile;
  
  // Use personalized bills API
  const { data: billsResponse, loading, error, refetch } = usePersonalizedBills(userProfile);
  
  useEffect(() => {
    const profile = global.userProfile;
    setHasProfile(profile?.onboardingComplete || false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleBillPress = useCallback((bill: Bill) => {
    // Track bill view
    apiService.trackBillView(bill.id, userProfile);
    router.push(`/bill/${bill.id}`);
  }, [router, userProfile]);

  if (!hasProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to CivicImpact</Text>
          <Text style={styles.welcomeSubtitle}>
            Understand how proposed legislation affects you personally
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <TrendingUp color="#2563EB" size={24} />
              <Text style={styles.featureText}>Personalized Impact Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Bell color="#059669" size={24} />
              <Text style={styles.featureText}>Real-time Legislation Updates</Text>
            </View>
            <View style={styles.featureItem}>
              <Users color="#7C3AED" size={24} />
              <Text style={styles.featureText}>Community Insights</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading && !billsResponse) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Your Civic Dashboard</Text>
        </View>
        
        <View style={styles.statsContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.statCard}>
              <LoadingSpinner size="small" message="" />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Legislation</Text>
          <LoadingBillCard />
          <LoadingBillCard />
        </View>
      </View>
    );
  }

  if (error && !billsResponse) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Your Civic Dashboard</Text>
        </View>
        <ErrorMessage 
          error={error} 
          onRetry={refetch}
          type={error.includes('network') ? 'network' : 'api'}
        />
      </View>
    );
  }

  const bills = billsResponse?.data || [];
  const highImpactBills = bills.filter(bill => bill.impactLevel === 'high');

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Your Civic Dashboard</Text>
        </View>

        {error && (
          <InlineError error={error} onRetry={refetch} />
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bills.length}</Text>
            <Text style={styles.statLabel}>Active Bills</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{highImpactBills.length}</Text>
            <Text style={styles.statLabel}>High Impact</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {bills.filter(bill => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(bill.lastActionDate) > weekAgo;
              }).length}
            </Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Legislation</Text>
          <Text style={styles.sectionSubtitle}>Bills that may affect you</Text>
          
          {bills.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No personalized bills found. Complete your profile to get better recommendations.
              </Text>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/profile/edit')}
              >
                <Text style={styles.profileButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bills.slice(0, 5).map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onPress={() => handleBillPress(bill)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginRight: 12,
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
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  legislationCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  levelBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  impactSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  impactDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  readMoreLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  profileButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});