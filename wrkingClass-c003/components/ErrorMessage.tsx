import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleAlert as AlertCircle, RefreshCw, Wifi } from 'lucide-react-native';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  type?: 'network' | 'api' | 'general';
}

export function ErrorMessage({ error, onRetry, type = 'general' }: ErrorMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <Wifi color="#DC2626" size={24} />;
      case 'api':
      case 'general':
      default:
        return <AlertCircle color="#DC2626" size={24} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'api':
        return 'Service Unavailable';
      case 'general':
      default:
        return 'Error';
    }
  };

  const getMessage = () => {
    if (type === 'network') {
      return 'Please check your internet connection and try again.';
    }
    return error || 'An unexpected error occurred.';
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.message}>{getMessage()}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw color="#FFFFFF" size={16} />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface InlineErrorProps {
  error: string;
  onRetry?: () => void;
}

export function InlineError({ error, onRetry }: InlineErrorProps) {
  return (
    <View style={styles.inlineContainer}>
      <View style={styles.inlineContent}>
        <AlertCircle color="#DC2626" size={16} />
        <Text style={styles.inlineText}>{error}</Text>
      </View>
      
      {onRetry && (
        <TouchableOpacity style={styles.inlineRetryButton} onPress={onRetry}>
          <RefreshCw color="#2563EB" size={14} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 24,
    marginVertical: 8,
  },
  inlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inlineText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  inlineRetryButton: {
    padding: 4,
  },
});