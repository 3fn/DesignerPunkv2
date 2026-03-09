import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { FileText, CircleAlert as AlertCircle, Clock, TrendingUp, Filter, Search, X } from 'lucide-react-native';
import { useBills, useApiLazy } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { LoadingSpinner, LoadingBillCard } from '@/components/LoadingSpinner';
import { ErrorMessage, InlineError } from '@/components/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Bill } from '@/types/api';

interface FilterState {
  level: string[];
  status: string[];
  impactLevel: string[];
  chamber: string[];
}

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
    <TouchableOpacity style={styles.billCard} onPress={onPress}>
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
      
      <Text style={styles.billTitle}>{bill.title}</Text>
      <Text style={styles.billSummary} numberOfLines={3}>
        {bill.summary}
      </Text>
      
      {bill.personalImpact && bill.personalImpact.reasons.length > 0 && (
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Personal Impact Estimate</Text>
          {bill.personalImpact.reasons.slice(0, 2).map((reason, index) => (
            <View key={index} style={styles.impactItem}>
              <TrendingUp color="#059669" size={16} />
              <Text style={styles.impactDescription}>{reason}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <View style={styles.timeStamp}>
          <Clock color="#9CA3AF" size={14} />
          <Text style={styles.timeText}>Updated {formatDate(bill.lastActionDate)}</Text>
        </View>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read Full Analysis</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function FilterChips({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}: { 
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}) {
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const newFilters = { ...filters };
    const currentValues = newFilters[category];
    
    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter(v => v !== value);
    } else {
      newFilters[category] = [...currentValues, value];
    }
    
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filters</Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
            <X color="#6B7280" size={16} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
        <TouchableOpacity
          style={[styles.chip, filters.impactLevel.includes('high') && styles.chipActive]}
          onPress={() => toggleFilter('impactLevel', 'high')}
        >
          <Text style={[styles.chipText, filters.impactLevel.includes('high') && styles.chipTextActive]}>
            High Impact
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chip, filters.level.includes('federal') && styles.chipActive]}
          onPress={() => toggleFilter('level', 'federal')}
        >
          <Text style={[styles.chipText, filters.level.includes('federal') && styles.chipTextActive]}>
            Federal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chip, filters.level.includes('state') && styles.chipActive]}
          onPress={() => toggleFilter('level', 'state')}
        >
          <Text style={[styles.chipText, filters.level.includes('state') && styles.chipTextActive]}>
            State
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chip, filters.chamber.includes('house') && styles.chipActive]}
          onPress={() => toggleFilter('chamber', 'house')}
        >
          <Text style={[styles.chipText, filters.chamber.includes('house') && styles.chipTextActive]}>
            House
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chip, filters.chamber.includes('senate') && styles.chipActive]}
          onPress={() => toggleFilter('chamber', 'senate')}
        >
          <Text style={[styles.chipText, filters.chamber.includes('senate') && styles.chipTextActive]}>
            Senate
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function LegislationContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    level: [],
    status: [],
    impactLevel: [],
    chamber: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  
  // API params based on filters
  const apiParams = useMemo(() => ({
    limit: 20,
    offset: 0,
    ...(filters.level.length > 0 && { level: filters.level[0] }),
    ...(filters.chamber.length > 0 && { chamber: filters.chamber[0] }),
  }), [filters]);

  // Use bills API with filters
  const { data: billsResponse, loading, error, refetch } = useBills(apiParams);
  
  // Search API
  const [executeSearch, searchState] = useApiLazy<any>();

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      await executeSearch(() => apiService.searchBills(query, {
        level: filters.level.length > 0 ? filters.level : undefined,
        chamber: filters.chamber.length > 0 ? filters.chamber : undefined,
      }));
    }
  }, [executeSearch, filters]);

  // Determine which data to show
  const displayData = searchQuery.trim() ? searchState.data : billsResponse;
  const displayLoading = searchQuery.trim() ? searchState.loading : loading;
  const displayError = searchQuery.trim() ? searchState.error : error;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (searchQuery.trim()) {
        await handleSearch(searchQuery);
      } else {
        await refetch();
      }
    } finally {
      setRefreshing(false);
    }
  }, [refetch, handleSearch, searchQuery]);

  const handleBillPress = useCallback((bill: Bill) => {
    // Track bill view
    apiService.trackBillView(bill.id, global.userProfile);
    router.push(`/bill/${bill.id}`);
  }, [router]);

  const clearFilters = useCallback(() => {
    setFilters({
      level: [],
      status: [],
      impactLevel: [],
      chamber: [],
    });
  }, []);

  const bills = displayData?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legislation</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bills..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#6B7280" size={20} />
            </TouchableOpacity>
          )}
        </View>
        
        {searchQuery.trim() && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FilterChips
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
        />

        {displayError && (
          <InlineError error={displayError} onRetry={onRefresh} />
        )}

        {displayLoading && bills.length === 0 ? (
          <View>
            <LoadingBillCard />
            <LoadingBillCard />
            <LoadingBillCard />
          </View>
        ) : bills.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#9CA3AF" size={48} />
            <Text style={styles.emptyStateTitle}>No Bills Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() 
                ? `No bills match your search for "${searchQuery}"`
                : 'No bills match your current filters'
              }
            </Text>
            {(searchQuery.trim() || Object.values(filters).some(arr => arr.length > 0)) && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => {
                  setSearchQuery('');
                  clearFilters();
                }}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search & Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onPress={() => handleBillPress(bill)}
            />
          ))
        )}

        {displayLoading && bills.length > 0 && (
          <View style={styles.loadingMore}>
            <LoadingSpinner size="small" message="Loading more..." />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function Legislation() {
  return (
    <ErrorBoundary>
      <LegislationContent />
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  searchButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterChips: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  billCard: {
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
  billTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  billSummary: {
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
  timeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  readMoreButton: {
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
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
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingMore: {
    paddingVertical: 20,
  },
});