export interface Bill {
  id: string;
  title: string;
  summary: string;
  status: 'introduced' | 'committee' | 'passed-house' | 'passed-senate' | 'signed' | 'vetoed';
  chamber: 'house' | 'senate' | 'both';
  level: 'federal' | 'state' | 'local';
  introducedDate: string;
  lastActionDate: string;
  sponsor: {
    name: string;
    party: string;
    state?: string;
    district?: string;
  };
  committees: string[];
  tags: string[];
  impactLevel: 'high' | 'medium' | 'low';
  personalImpact?: {
    score: number;
    reasons: string[];
    estimatedEffect?: string;
  };
  fullText?: string;
  amendments?: Amendment[];
  votes?: Vote[];
}

export interface Amendment {
  id: string;
  number: string;
  purpose: string;
  sponsor: string;
  status: string;
  submittedDate: string;
}

export interface Vote {
  id: string;
  chamber: string;
  date: string;
  question: string;
  result: 'passed' | 'failed';
  yesVotes: number;
  noVotes: number;
  abstentions: number;
  breakdown: {
    party: string;
    yes: number;
    no: number;
    abstain: number;
  }[];
}

export interface Representative {
  id: string;
  name: string;
  title: string;
  party: string;
  chamber: 'house' | 'senate';
  state: string;
  district?: string;
  office: string;
  phone: string;
  email?: string;
  website: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  committees: string[];
  leadership?: string;
  nextElection: string;
  termStart: string;
  termEnd: string;
  photo?: string;
  biography?: string;
  votingRecord?: {
    billId: string;
    vote: 'yes' | 'no' | 'abstain';
    date: string;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    lastUpdated: string;
    source: string;
  };
}

export interface ApiError {
  error: string;
  message: string;
  code: number;
  details?: any;
}

export interface UserProfile {
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
  onboardingComplete?: boolean;
}

export interface PersonalizedBillsRequest {
  profile: UserProfile;
  limit?: number;
  offset?: number;
  filters?: {
    level?: ('federal' | 'state' | 'local')[];
    status?: string[];
    impactLevel?: ('high' | 'medium' | 'low')[];
    tags?: string[];
  };
}