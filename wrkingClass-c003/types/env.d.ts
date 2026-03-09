declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      EXPO_PUBLIC_CONGRESS_API_KEY: string;
      EXPO_PUBLIC_ENVIRONMENT: string;
      EXPO_PUBLIC_ANALYTICS_ID: string;
    }
  }
}

export {};