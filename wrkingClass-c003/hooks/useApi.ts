import { useState, useEffect, useCallback } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export function useApiLazy<T>(): [
  (apiCall: () => Promise<T>) => Promise<void>,
  UseApiState<T>
] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // For lazy hooks, refetch doesn't make sense without the original apiCall
    // This is a placeholder that could be enhanced if needed
  }, []);

  return [execute, { data, loading, error, refetch }];
}

// Specialized hooks for common API operations
export function useBills(params?: {
  limit?: number;
  offset?: number;
  level?: string;
  status?: string;
  chamber?: string;
  tags?: string[];
}) {
  const { apiService } = require('@/services/api');
  
  return useApi(
    () => apiService.getBills(params),
    [params?.limit, params?.offset, params?.level, params?.status, params?.chamber, JSON.stringify(params?.tags)]
  );
}

export function useBill(id: string) {
  const { apiService } = require('@/services/api');
  
  return useApi(
    () => apiService.getBill(id),
    [id]
  );
}

export function useRepresentatives(zipCode: string) {
  const { apiService } = require('@/services/api');
  
  return useApi(
    () => apiService.getRepresentatives(zipCode),
    [zipCode]
  );
}

export function usePersonalizedBills(userProfile: any) {
  const { apiService } = require('@/services/api');
  
  return useApi(
    () => apiService.getPersonalizedBills({ profile: userProfile }),
    [JSON.stringify(userProfile)]
  );
}