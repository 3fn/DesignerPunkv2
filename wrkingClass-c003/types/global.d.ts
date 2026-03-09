declare global {
  var userProfile: {
    zipCode?: string;
    ageRange?: string;
    gender?: string;
    jobTitle?: string;
    jobIndustry?: string;
    incomeRange?: string;
    interests?: string[];
    // Updated family fields
    isMarried?: boolean;
    hasChildren?: boolean;
    childrenCount?: string;
    caresForElderly?: boolean;
    elderlyAreDependent?: boolean;
    onboardingComplete?: boolean;
  };
}

export {};