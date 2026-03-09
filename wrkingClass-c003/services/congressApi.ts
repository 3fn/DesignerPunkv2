import { Bill, Representative, ApiResponse } from '@/types/api';

const CONGRESS_API_BASE = 'https://api.congress.gov/v3';
const API_KEY = process.env.EXPO_PUBLIC_CONGRESS_API_KEY || 'uaugbgD6hfkWzhoB9pwWGzZm9zE0gdg7u8iC94Y8';

interface CongressBill {
  congress: number;
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
  url: string;
  latestAction?: {
    actionDate: string;
    text: string;
  };
  sponsors?: Array<{
    bioguideId: string;
    district?: number;
    firstName: string;
    fullName: string;
    lastName: string;
    middleName?: string;
    party: string;
    state: string;
    url: string;
  }>;
  policyArea?: {
    name: string;
  };
  subjects?: {
    legislativeSubjects: Array<{
      name: string;
    }>;
  };
  summaries?: Array<{
    actionDate: string;
    actionDesc: string;
    text: string;
    updateDate: string;
    versionCode: string;
  }>;
  textVersions?: Array<{
    date: string;
    type: string;
    formats: Array<{
      type: string;
      url: string;
    }>;
  }>;
  actions?: Array<{
    actionDate: string;
    text: string;
    type: string;
    actionCode?: string;
    sourceSystem: {
      code: number;
      name: string;
    };
  }>;
  committees?: Array<{
    name: string;
    chamber: string;
    type: string;
    systemCode: string;
    url: string;
  }>;
  relatedBills?: Array<{
    congress: number;
    number: string;
    type: string;
    relationshipDetails: Array<{
      type: string;
      identifiedBy: string;
    }>;
  }>;
  cosponsors?: {
    count: number;
    countIncludingWithdrawnCosponsors: number;
    url: string;
  };
  cboCostEstimates?: Array<{
    description: string;
    pubDate: string;
    title: string;
    url: string;
  }>;
}

interface CongressMember {
  bioguideId: string;
  district?: number;
  name: string;
  partyName: string;
  state: string;
  terms: Array<{
    chamber: string;
    congress: number;
    endYear: number;
    startYear: number;
  }>;
  updateDate: string;
  url: string;
  depiction?: {
    attribution: string;
    imageUrl: string;
  };
  addressInformation?: {
    city: string;
    district?: string;
    officeAddress: string;
    phoneNumber: string;
    zipCode: string;
  };
  leadership?: Array<{
    congress: number;
    current: boolean;
    type: string;
  }>;
  sponsorshipStatistics?: {
    count: number;
    url: string;
  };
}

class CongressApiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${CONGRESS_API_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Congress API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch from Congress API');
    }
  }

  private mapCongressBillToBill(congressBill: CongressBill, personalImpact?: any): Bill {
    const chamber = congressBill.originChamberCode === 'H' ? 'house' : 'senate';
    const sponsor = congressBill.sponsors?.[0];
    
    // Determine impact level based on policy area and subjects
    const impactLevel = this.determineImpactLevel(congressBill);
    
    // Get the most recent summary
    const summary = congressBill.summaries?.[0]?.text || 
                   congressBill.title || 
                   'No summary available';

    return {
      id: `${congressBill.congress}-${congressBill.type}-${congressBill.number}`,
      title: congressBill.title,
      summary: this.cleanSummaryText(summary),
      status: this.mapCongressStatus(congressBill.latestAction?.text || ''),
      chamber,
      level: 'federal',
      introducedDate: congressBill.updateDate,
      lastActionDate: congressBill.latestAction?.actionDate || congressBill.updateDate,
      sponsor: sponsor ? {
        name: sponsor.fullName,
        party: sponsor.party,
        state: sponsor.state,
        district: sponsor.district?.toString(),
      } : {
        name: 'Unknown',
        party: 'Unknown',
        state: 'Unknown',
      },
      committees: congressBill.committees?.map(c => c.name) || [],
      tags: [
        ...(congressBill.policyArea ? [congressBill.policyArea.name] : []),
        ...(congressBill.subjects?.legislativeSubjects?.slice(0, 5).map(s => s.name) || []),
      ],
      impactLevel,
      personalImpact,
    };
  }

  private determineImpactLevel(bill: CongressBill): 'high' | 'medium' | 'low' {
    const policyArea = bill.policyArea?.name?.toLowerCase() || '';
    const subjects = bill.subjects?.legislativeSubjects?.map(s => s.name.toLowerCase()) || [];
    
    // High impact areas
    const highImpactAreas = [
      'economics and public finance',
      'health',
      'taxation',
      'social welfare',
      'education',
      'housing and community development',
      'labor and employment',
      'immigration',
      'civil rights and liberties',
      'healthcare',
      'social security',
      'medicare',
      'medicaid',
    ];

    // Medium impact areas
    const mediumImpactAreas = [
      'transportation and public works',
      'energy',
      'environmental protection',
      'science, technology, communications',
      'agriculture and food',
      'commerce',
      'finance and financial sector',
      'government operations and politics',
    ];

    const allTerms = [policyArea, ...subjects].join(' ');
    
    if (highImpactAreas.some(area => allTerms.includes(area))) {
      return 'high';
    } else if (mediumImpactAreas.some(area => allTerms.includes(area))) {
      return 'medium';
    }
    
    return 'low';
  }

  private mapCongressStatus(latestAction: string): Bill['status'] {
    const action = latestAction.toLowerCase();
    
    if (action.includes('signed') || action.includes('became public law')) {
      return 'signed';
    } else if (action.includes('passed senate') || action.includes('passed/agreed to in senate')) {
      return 'passed-senate';
    } else if (action.includes('passed house') || action.includes('passed/agreed to in house')) {
      return 'passed-house';
    } else if (action.includes('committee') || action.includes('referred to')) {
      return 'committee';
    } else if (action.includes('vetoed')) {
      return 'vetoed';
    }
    
    return 'introduced';
  }

  private cleanSummaryText(text: string): string {
    // Remove HTML tags and clean up the text
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500) + (text.length > 500 ? '...' : '');
  }

  private calculatePersonalImpact(bill: CongressBill, userProfile: any): any {
    if (!userProfile) return null;

    const reasons: string[] = [];
    let score = 0;

    const policyArea = bill.policyArea?.name?.toLowerCase() || '';
    const subjects = bill.subjects?.legislativeSubjects?.map(s => s.name.toLowerCase()) || [];
    const allTerms = [policyArea, ...subjects].join(' ');

    // Income-based impact
    if (userProfile.incomeRange) {
      if (allTerms.includes('taxation') || allTerms.includes('tax')) {
        reasons.push('This bill may affect your tax obligations');
        score += 3;
      }
      
      if (allTerms.includes('social security') && userProfile.ageRange === '65+') {
        reasons.push('This bill may impact your Social Security benefits');
        score += 4;
      }
    }

    // Family-based impact
    if (userProfile.hasChildren && (allTerms.includes('education') || allTerms.includes('child'))) {
      reasons.push('This bill may affect educational opportunities for your children');
      score += 3;
    }

    if (userProfile.hasChildren && allTerms.includes('child tax credit')) {
      reasons.push('This bill may change child tax credit amounts');
      score += 4;
    }

    // Healthcare impact
    if (allTerms.includes('health') || allTerms.includes('medicare') || allTerms.includes('medicaid')) {
      reasons.push('This bill may affect healthcare costs and coverage');
      score += 2;
      
      if (userProfile.ageRange === '65+') {
        score += 2;
      }
    }

    // Employment impact
    if (allTerms.includes('labor') || allTerms.includes('employment') || allTerms.includes('minimum wage')) {
      reasons.push('This bill may affect employment regulations and wages');
      score += 2;
    }

    // Interest-based impact
    if (userProfile.interests) {
      const interestMap: { [key: string]: string[] } = {
        'healthcare': ['health', 'medicare', 'medicaid', 'insurance'],
        'education': ['education', 'student', 'school'],
        'environment': ['environment', 'climate', 'energy', 'pollution'],
        'technology': ['technology', 'internet', 'privacy', 'data'],
        'housing': ['housing', 'mortgage', 'rent'],
        'transportation': ['transportation', 'infrastructure', 'highway'],
      };

      userProfile.interests.forEach((interest: string) => {
        const keywords = interestMap[interest] || [];
        if (keywords.some(keyword => allTerms.includes(keyword))) {
          reasons.push(`This bill relates to ${interest}, one of your interests`);
          score += 1;
        }
      });
    }

    if (reasons.length === 0) return null;

    return {
      score,
      reasons: reasons.slice(0, 3), // Limit to top 3 reasons
      estimatedEffect: score >= 6 ? 'High potential impact' : 
                      score >= 3 ? 'Moderate potential impact' : 
                      'Low potential impact'
    };
  }

  // Public API methods
  async getBills(params?: {
    limit?: number;
    offset?: number;
    congress?: number;
    chamber?: string;
  }): Promise<ApiResponse<Bill[]>> {
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const congress = params?.congress || 118; // Current Congress

    let endpoint = `/bill/${congress}?format=json&limit=${limit}&offset=${offset}`;
    
    // Add chamber filter if specified
    if (params?.chamber === 'house') {
      endpoint += '&type=hr,hjres,hconres,hres';
    } else if (params?.chamber === 'senate') {
      endpoint += '&type=s,sjres,sconres,sres';
    }

    const response = await this.makeRequest<{
      bills: CongressBill[];
      pagination: {
        count: number;
        next?: string;
        previous?: string;
      };
    }>(endpoint);

    const bills = response.bills.map(bill => this.mapCongressBillToBill(bill));

    return {
      data: bills,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total: response.pagination.count,
        hasNext: !!response.pagination.next,
        hasPrev: !!response.pagination.previous,
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: 'Congress.gov API',
      },
    };
  }

  async getBill(id: string): Promise<Bill> {
    // Parse bill ID: format is "congress-type-number"
    const [congress, type, number] = id.split('-');
    
    const endpoint = `/bill/${congress}/${type}/${number}?format=json`;
    const response = await this.makeRequest<{ bill: CongressBill }>(endpoint);
    
    return this.mapCongressBillToBill(response.bill);
  }

  async getPersonalizedBills(userProfile: any, params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Bill[]>> {
    // Get recent bills and calculate personal impact
    const billsResponse = await this.getBills(params);
    
    const personalizedBills = billsResponse.data.map(bill => {
      // Re-fetch the original congress bill data to calculate impact
      const billId = bill.id.split('-');
      return this.makeRequest<{ bill: CongressBill }>(`/bill/${billId[0]}/${billId[1]}/${billId[2]}?format=json`)
        .then(response => {
          const personalImpact = this.calculatePersonalImpact(response.bill, userProfile);
          return {
            ...bill,
            personalImpact,
            impactLevel: personalImpact?.score >= 6 ? 'high' as const :
                        personalImpact?.score >= 3 ? 'medium' as const :
                        bill.impactLevel
          };
        })
        .catch(() => bill); // Fallback to original bill if detailed fetch fails
    });

    const resolvedBills = await Promise.all(personalizedBills);
    
    // Sort by personal impact score
    const sortedBills = resolvedBills.sort((a, b) => {
      const scoreA = a.personalImpact?.score || 0;
      const scoreB = b.personalImpact?.score || 0;
      return scoreB - scoreA;
    });

    return {
      ...billsResponse,
      data: sortedBills,
    };
  }

  async searchBills(query: string, filters?: {
    congress?: number;
    chamber?: string[];
  }): Promise<ApiResponse<Bill[]>> {
    const congress = filters?.congress || 118;
    let endpoint = `/bill/${congress}?format=json&limit=50`;
    
    // Add chamber filter
    if (filters?.chamber?.length) {
      const chamberTypes = filters.chamber.includes('house') ? 'hr,hjres,hconres,hres' : '';
      const senateTypes = filters.chamber.includes('senate') ? 's,sjres,sconres,sres' : '';
      const types = [chamberTypes, senateTypes].filter(Boolean).join(',');
      if (types) {
        endpoint += `&type=${types}`;
      }
    }

    const response = await this.makeRequest<{
      bills: CongressBill[];
      pagination: {
        count: number;
      };
    }>(endpoint);

    // Filter bills by search query (client-side filtering since Congress API doesn't support text search)
    const filteredBills = response.bills.filter(bill => {
      const searchText = `${bill.title} ${bill.policyArea?.name || ''} ${bill.subjects?.legislativeSubjects?.map(s => s.name).join(' ') || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    const bills = filteredBills.map(bill => this.mapCongressBillToBill(bill));

    return {
      data: bills,
      pagination: {
        page: 1,
        limit: 50,
        total: filteredBills.length,
        hasNext: false,
        hasPrev: false,
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: 'Congress.gov API',
      },
    };
  }

  async getMembers(chamber?: 'house' | 'senate', state?: string): Promise<ApiResponse<Representative[]>> {
    const congress = 118; // Current Congress
    let endpoint = `/member/${congress}?format=json&limit=600`;
    
    if (chamber) {
      endpoint += `&currentMember=true`;
    }

    const response = await this.makeRequest<{
      members: CongressMember[];
      pagination: {
        count: number;
      };
    }>(endpoint);

    let filteredMembers = response.members;

    // Filter by chamber and state
    if (chamber || state) {
      filteredMembers = response.members.filter(member => {
        const currentTerm = member.terms.find(term => term.congress === congress);
        const matchesChamber = !chamber || currentTerm?.chamber.toLowerCase() === chamber;
        const matchesState = !state || member.state === state;
        return matchesChamber && matchesState;
      });
    }

    const representatives = filteredMembers.map(member => this.mapCongressMemberToRepresentative(member));

    return {
      data: representatives,
      pagination: {
        page: 1,
        limit: 600,
        total: filteredMembers.length,
        hasNext: false,
        hasPrev: false,
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        source: 'Congress.gov API',
      },
    };
  }

  private mapCongressMemberToRepresentative(member: CongressMember): Representative {
    const currentTerm = member.terms.find(term => term.congress === 118) || member.terms[0];
    const chamber = currentTerm?.chamber.toLowerCase() as 'house' | 'senate';
    
    return {
      id: member.bioguideId,
      name: member.name,
      title: chamber === 'senate' ? 'Senator' : 'Representative',
      party: member.partyName,
      chamber,
      state: member.state,
      district: member.district?.toString(),
      office: member.addressInformation?.officeAddress || 'Office information not available',
      phone: member.addressInformation?.phoneNumber || 'Phone not available',
      website: `https://www.congress.gov/member/${member.bioguideId}`,
      socialMedia: {},
      committees: [], // Would need separate API call to get committee info
      nextElection: chamber === 'senate' ? '2026-11-03' : '2024-11-05', // Approximate
      termStart: `${currentTerm?.startYear}-01-03`,
      termEnd: `${currentTerm?.endYear}-01-03`,
      photo: member.depiction?.imageUrl,
    };
  }
}

export const congressApi = new CongressApiService();