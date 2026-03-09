import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Building, 
  Tag, 
  TrendingUp, 
  ExternalLink,
  Clock,
  FileText,
  Users,
  CircleAlert as AlertCircle
} from 'lucide-react-native';
import { useBill } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function BillDetailContent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const { data: bill, loading, error, refetch } = useBill(id!);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return '#059669';
      case 'passed-house':
      case 'passed-senate': return '#2563EB';
      case 'committee': return '#D97706';
      case 'vetoed': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'signed': return '#ECFDF5';
      case 'passed-house':
      case 'passed-senate': return '#EFF6FF';
      case 'committee': return '#FEF3C7';
      case 'vetoed': return '#FEF2F2';
      default: return '#F3F4F6';
    }
  };

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'introduced': return 'Introduced';
      case 'committee': return 'In Committee';
      case 'passed-house': return 'Passed House';
      case 'passed-senate': return 'Passed Senate';
      case 'signed': return 'Signed into Law';
      case 'vetoed': return 'Vetoed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Details</Text>
        </View>
        <LoadingSpinner message="Loading bill details..." />
      </View>
    );
  }

  if (error || !bill) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Details</Text>
        </View>
        <ErrorMessage 
          error={error || 'Bill not found'} 
          onRetry={refetch}
          type="api"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#6B7280" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Bill Header */}
        <View style={styles.billHeader}>
          <View style={styles.billBadges}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackground(bill.status) }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(bill.status) }
              ]}>
                {getStatusLabel(bill.status)}
              </Text>
            </View>
            
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
          </View>

          <Text style={styles.billTitle}>{bill.title}</Text>
          
          <View style={styles.billMeta}>
            <View style={styles.metaItem}>
              <Building color="#6B7280" size={16} />
              <Text style={styles.metaText}>
                {bill.chamber.charAt(0).toUpperCase() + bill.chamber.slice(1)} • {bill.level.charAt(0).toUpperCase() + bill.level.slice(1)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Calendar color="#6B7280" size={16} />
              <Text style={styles.metaText}>
                Introduced {formatDate(bill.introducedDate)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Clock color="#6B7280" size={16} />
              <Text style={styles.metaText}>
                Last Action {formatDate(bill.lastActionDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{bill.summary}</Text>
        </View>

        {/* Personal Impact */}
        {bill.personalImpact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Impact Analysis</Text>
            <View style={styles.impactCard}>
              <View style={styles.impactHeader}>
                <TrendingUp color="#059669" size={20} />
                <Text style={styles.impactScore}>
                  Impact Score: {bill.personalImpact.score}/10
                </Text>
              </View>
              
              {bill.personalImpact.estimatedEffect && (
                <Text style={styles.impactEffect}>
                  {bill.personalImpact.estimatedEffect}
                </Text>
              )}
              
              <View style={styles.impactReasons}>
                {bill.personalImpact.reasons.map((reason, index) => (
                  <View key={index} style={styles.impactReason}>
                    <View style={styles.reasonDot} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Sponsor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsor</Text>
          <View style={styles.sponsorCard}>
            <User color="#2563EB" size={20} />
            <View style={styles.sponsorInfo}>
              <Text style={styles.sponsorName}>{bill.sponsor.name}</Text>
              <Text style={styles.sponsorDetails}>
                {bill.sponsor.party} • {bill.sponsor.state}
                {bill.sponsor.district && ` District ${bill.sponsor.district}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Committees */}
        {bill.committees.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Committees</Text>
            <View style={styles.committeesContainer}>
              {bill.committees.map((committee, index) => (
                <View key={index} style={styles.committeeTag}>
                  <Users color="#6B7280" size={14} />
                  <Text style={styles.committeeText}>{committee}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {bill.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Policy Areas</Text>
            <View style={styles.tagsContainer}>
              {bill.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Tag color="#6B7280" size={14} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <ExternalLink color="#2563EB" size={20} />
            <Text style={styles.actionButtonText}>View Full Text on Congress.gov</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FileText color="#2563EB" size={20} />
            <Text style={styles.actionButtonText}>Track This Bill</Text>
          </TouchableOpacity>
        </View>

        {/* Amendments */}
        {bill.amendments && bill.amendments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amendments</Text>
            {bill.amendments.slice(0, 3).map((amendment, index) => (
              <View key={index} style={styles.amendmentCard}>
                <Text style={styles.amendmentNumber}>Amendment {amendment.number}</Text>
                <Text style={styles.amendmentPurpose}>{amendment.purpose}</Text>
                <Text style={styles.amendmentSponsor}>
                  Sponsored by {amendment.sponsor} • {formatDate(amendment.submittedDate)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Votes */}
        {bill.votes && bill.votes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Votes</Text>
            {bill.votes.slice(0, 2).map((vote, index) => (
              <View key={index} style={styles.voteCard}>
                <View style={styles.voteHeader}>
                  <Text style={styles.voteQuestion}>{vote.question}</Text>
                  <Text style={[
                    styles.voteResult,
                    { color: vote.result === 'passed' ? '#059669' : '#DC2626' }
                  ]}>
                    {vote.result.toUpperCase()}
                  </Text>
                </View>
                
                <Text style={styles.voteDate}>
                  {vote.chamber.toUpperCase()} • {formatDate(vote.date)}
                </Text>
                
                <View style={styles.voteTally}>
                  <Text style={styles.voteCount}>
                    Yes: {vote.yesVotes} • No: {vote.noVotes} • Abstain: {vote.abstentions}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function BillDetail() {
  return (
    <ErrorBoundary>
      <BillDetailContent />
    </ErrorBoundary>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  billHeader: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  billBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  billTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 16,
  },
  billMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  impactCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  impactScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  impactEffect: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  impactReasons: {
    gap: 12,
  },
  impactReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginTop: 6,
  },
  reasonText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  sponsorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sponsorDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  committeesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  committeeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  committeeText: {
    fontSize: 14,
    color: '#374151',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#2563EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
  },
  amendmentCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  amendmentNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },
  amendmentPurpose: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  amendmentSponsor: {
    fontSize: 12,
    color: '#6B7280',
  },
  voteCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  voteQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  voteResult: {
    fontSize: 12,
    fontWeight: '700',
  },
  voteDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  voteTally: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  voteCount: {
    fontSize: 12,
    color: '#6B7280',
  },
});