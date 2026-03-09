import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large',
  color = '#2563EB' 
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

interface LoadingCardProps {
  height?: number;
}

export function LoadingCard({ height = 200 }: LoadingCardProps) {
  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.shimmer} />
    </View>
  );
}

export function LoadingBillCard() {
  return (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={[styles.shimmer, styles.badge]} />
        <View style={[styles.shimmer, styles.levelBadge]} />
      </View>
      
      <View style={[styles.shimmer, styles.title]} />
      <View style={[styles.shimmer, styles.subtitle]} />
      <View style={[styles.shimmer, styles.description]} />
      
      <View style={styles.billFooter}>
        <View style={[styles.shimmer, styles.timestamp]} />
        <View style={[styles.shimmer, styles.readMore]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  shimmer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
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
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    width: 80,
    height: 24,
    borderRadius: 12,
  },
  levelBadge: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
  title: {
    width: '80%',
    height: 20,
    marginBottom: 8,
  },
  subtitle: {
    width: '60%',
    height: 16,
    marginBottom: 16,
  },
  description: {
    width: '100%',
    height: 60,
    marginBottom: 16,
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  timestamp: {
    width: 100,
    height: 14,
  },
  readMore: {
    width: 120,
    height: 16,
  },
});