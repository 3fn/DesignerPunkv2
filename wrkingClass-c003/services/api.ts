import { Bill, Representative, ApiResponse, ApiError, PersonalizedBillsRequest } from '@/types/api';
import { congressApi } from './congressApi';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.civicimpact.app';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status,
        }));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Bills API - Now using Congress.gov API
  async getBills(params?: {
    limit?: number;
    offset?: number;
    level?: string;
    status?: string;
    chamber?: string;
    tags?: string[];
  }): Promise<ApiResponse<Bill[]>> {
    // For federal bills, use Congress API
    if (!params?.level || params.level === 'federal') {
      return congressApi.getBills({
        limit: params?.limit,
        offset: params?.offset,
        chamber: params?.chamber as 'house' | 'senate',
      });
    }

    // For state/local bills, fall back to original API
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.level) searchParams.append('level', params.level);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.chamber) searchParams.append('chamber', params.chamber);
    if (params?.tags) {
      params.tags.forEach(tag => searchParams.append('tags', tag));
    }

    const queryString = searchParams.toString();
    const endpoint = `/bills${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<ApiResponse<Bill[]>>(endpoint);
  }

  async getBill(id: string): Promise<Bill> {
    // Check if this is a Congress bill ID (format: congress-type-number)
    if (id.match(/^\d+-[a-z]+-\d+$/)) {
      return congressApi.getBill(id);
    }

    // Fall back to original API
    const response = await this.makeRequest<ApiResponse<Bill>>(`/bills/${id}`);
    return response.data;
  }

  async getPersonalizedBills(request: PersonalizedBillsRequest): Promise<ApiResponse<Bill[]>> {
    // Use Congress API for personalized federal bills
    try {
      return await congressApi.getPersonalizedBills(request.profile, {
        limit: request.limit,
        offset: request.offset,
      });
    } catch (error) {
      console.warn('Congress API failed, falling back to mock data:', error);
      
      // Fallback to mock data if Congress API fails
      return this.getMockPersonalizedBills(request);
    }
  }

  async searchBills(query: string, filters?: {
    level?: string[];
    status?: string[];
    chamber?: string[];
  }): Promise<ApiResponse<Bill[]>> {
    // For federal bills, use Congress API
    if (!filters?.level || filters.level.includes('federal')) {
      try {
        return await congressApi.searchBills(query, {
          chamber: filters?.chamber as ('house' | 'senate')[],
        });
      } catch (error) {
        console.warn('Congress API search failed:', error);
      }
    }

    // Fall back to original API
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (filters?.level) {
      filters.level.forEach(level => searchParams.append('level', level));
    }
    if (filters?.status) {
      filters.status.forEach(status => searchParams.append('status', status));
    }
    if (filters?.chamber) {
      filters.chamber.forEach(chamber => searchParams.append('chamber', chamber));
    }

    return this.makeRequest<ApiResponse<Bill[]>>(`/bills/search?${searchParams.toString()}`);
  }

  // Representatives API - Enhanced with Congress.gov data
  async getRepresentatives(zipCode: string): Promise<ApiResponse<Representative[]>> {
    try {
      // First, get location info to determine state
      const locationInfo = await this.getLocationInfo(zipCode);
      
      // Get federal representatives from Congress API
      const federalReps = await congressApi.getMembers(undefined, locationInfo.state);
      
      return federalReps;
    } catch (error) {
      console.warn('Failed to get representatives from Congress API:', error);
      
      // Fallback to mock data
      return this.getMockRepresentatives(zipCode);
    }
  }

  async getRepresentative(id: string): Promise<Representative> {
    const response = await this.makeRequest<ApiResponse<Representative>>(`/representatives/${id}`);
    return response.data;
  }

  async getRepresentativesByState(state: string): Promise<ApiResponse<Representative[]>> {
    return congressApi.getMembers(undefined, state);
  }

  // Location API
  async getLocationInfo(zipCode: string): Promise<{
    city: string;
    state: string;
    county: string;
    congressionalDistrict: string;
    stateDistricts: {
      senate: string;
      house: string;
    };
    timezone: string;
  }> {
    // Mock location data based on zip code patterns
    const locationMap: { [key: string]: any } = {
      '97201': { city: 'Portland', state: 'OR', county: 'Multnomah' },
      '94102': { city: 'San Francisco', state: 'CA', county: 'San Francisco' },
      '10001': { city: 'New York', state: 'NY', county: 'New York' },
      '60601': { city: 'Chicago', state: 'IL', county: 'Cook' },
      '20001': { city: 'Washington', state: 'DC', county: 'District of Columbia' },
    };

    const location = locationMap[zipCode] || { city: 'Unknown', state: 'Unknown', county: 'Unknown' };
    
    return {
      ...location,
      congressionalDistrict: '1',
      stateDistricts: {
        senate: '1',
        house: '1',
      },
      timezone: 'America/New_York',
    };
  }

  // Analytics API
  async trackBillView(billId: string, userProfile?: any): Promise<void> {
    try {
      await this.makeRequest('/analytics/bill-view', {
        method: 'POST',
        body: JSON.stringify({
          billId,
          userProfile,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Analytics failures shouldn't break the app
      console.warn('Failed to track bill view:', error);
    }
  }

  async trackUserAction(action: string, data?: any): Promise<void> {
    try {
      await this.makeRequest('/analytics/user-action', {
        method: 'POST',
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn('Failed to track user action:', error);
    }
  }

  // Fallback methods for when Congress API is unavailable
  private async getMockPersonalizedBills(request: PersonalizedBillsRequest): Promise<ApiResponse<Bill[]>> {
    const mockBills: Bill[] = [
      {
        id: 'mock-1',
        title: 'Build Back Better Act (H.R. 5376)',
        summary: 'Comprehensive social spending and climate package including expanded child tax credits, universal pre-K, and clean energy investments.',
        status: 'committee',
        chamber: 'house',
        level: 'federal',
        introducedDate: '2023-10-15',
        lastActionDate: '2023-12-01',
        sponsor: {
          name: 'Rep. John Smith',
          party: 'Democratic',
          state: 'CA',
          district: '12',
        },
        committees: ['Ways and Means', 'Energy and Commerce'],
        tags: ['Social Policy', 'Climate', 'Taxation'],
        impactLevel: 'high',
        personalImpact: {
          score: 8,
          reasons: [
            'Could provide $3,600 annual child tax credit if you have children under 6',
            'May reduce prescription drug costs by 15-25% through Medicare negotiation',
            'Includes clean energy tax credits for homeowners',
          ],
          estimatedEffect: 'High potential impact',
        },
      },
    ];

    return {
      data: mockBills,
      pagination: {
        page: 1,
        limit: 20,
        total: mockBills.length,
        hasNext: false,
        hasPrev: false,
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: 'Mock Data',
      },
    };
  }

  private async getMockRepresentatives(zipCode: string): Promise<ApiResponse<Representative[]>> {
    const mockReps: Representative[] = [
      {
        id: 'mock-sen-1',
        name: 'Senator Jane Doe',
        title: 'Senator',
        party: 'Democratic',
        chamber: 'senate',
        state: 'CA',
        office: '123 Hart Senate Office Building',
        phone: '(202) 224-1234',
        email: 'senator@senate.gov',
        website: 'https://senate.gov/senator',
        socialMedia: {
          twitter: '@SenatorDoe',
          facebook: 'SenatorJaneDoe',
        },
        committees: ['Judiciary', 'Health, Education, Labor and Pensions'],
        nextElection: '2026-11-03',
        termStart: '2021-01-03',
        termEnd: '2027-01-03',
        photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    ];

    return {
      data: mockReps,
      pagination: {
        page: 1,
        limit: 10,
        total: mockReps.length,
        hasNext: false,
        hasPrev: false,
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: 'Mock Data',
      },
    };
  }
}

export const apiService = new ApiService();