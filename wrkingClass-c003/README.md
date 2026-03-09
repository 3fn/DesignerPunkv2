# CivicImpact - Federal Legislation Tracker

A React Native Expo app that helps citizens understand how federal legislation affects them personally using real data from the Congress.gov API.

## Features

### 🏛️ **Real Federal Data**
- Live federal legislation from Congress.gov API
- Current House and Senate bills
- Real-time bill status updates
- Actual sponsor and committee information

### 🎯 **Personalized Impact Analysis**
- Bills filtered by your demographics and interests
- Personal impact scoring based on your profile
- Customized explanations of how bills affect you
- Location-based representative information

### 📱 **Modern Mobile Experience**
- Beautiful, production-ready UI design
- Smooth animations and micro-interactions
- Pull-to-refresh functionality
- Comprehensive error handling and loading states

### 🔍 **Advanced Search & Filtering**
- Search bills by title, policy area, or keywords
- Filter by chamber (House/Senate)
- Filter by impact level (High/Medium/Low)
- Real-time search results

### 👥 **Representative Information**
- Your federal representatives based on zip code
- Contact information and office details
- Committee assignments and leadership roles
- Direct calling and emailing capabilities

## API Integration

### Congress.gov API
This app uses the official Congress.gov API to provide:
- Current federal bills (118th Congress)
- Bill summaries, sponsors, and status
- Committee assignments
- Member information
- Real-time legislative updates

### Personal Impact Calculation
The app analyzes bills based on your profile:
- **Demographics**: Age, income, family status
- **Location**: Congressional district representation
- **Interests**: Policy areas you care about
- **Life Situation**: Children, elderly care, employment

## Setup Instructions

### 1. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
# Congress.gov API (already configured)
EXPO_PUBLIC_CONGRESS_API_KEY=uaugbgD6hfkWzhoB9pwWGzZm9zE0gdg7u8iC94Y8

# Optional: Fallback API for state/local bills
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
EXPO_PUBLIC_API_KEY=your_api_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Project Structure

```
app/
├── (tabs)/                 # Main tab navigation
│   ├── index.tsx          # Dashboard with personalized bills
│   ├── legislation.tsx    # Browse and search all bills
│   ├── representatives.tsx # Your federal representatives
│   ├── donate.tsx         # Support the platform
│   └── profile.tsx        # User profile and settings
├── onboarding/            # User setup flow
├── profile/               # Profile management
└── bill/[id].tsx         # Individual bill details

components/
├── ErrorBoundary.tsx      # Error handling
├── LoadingSpinner.tsx     # Loading states
└── ErrorMessage.tsx       # Error displays

services/
├── congressApi.ts         # Congress.gov API integration
└── api.ts                # Main API service

hooks/
└── useApi.ts             # API data fetching hooks

types/
└── api.ts                # TypeScript interfaces
```

## Key Features Explained

### Dashboard
- Personalized bill recommendations
- Impact statistics
- Recent legislative activity
- Quick access to high-impact bills

### Legislation Browser
- Search federal bills by keyword
- Filter by chamber and impact level
- Detailed bill information
- Personal impact analysis

### Representatives
- Automatic detection based on zip code
- Contact information and office details
- Committee assignments
- Direct communication options

### Bill Details
- Complete bill information
- Personal impact breakdown
- Sponsor and committee details
- Amendment and voting history
- Links to full text on Congress.gov

## Data Sources

- **Federal Bills**: Congress.gov API (Library of Congress)
- **Representatives**: Congress.gov Members API
- **Personal Impact**: Custom algorithm based on user profile
- **Location Data**: Zip code to congressional district mapping

## Privacy & Security

- All personal data stored locally on device
- No personal information sent to external APIs
- Optional analytics for app improvement
- Transparent data usage policies

## Contributing

This is an open-source civic engagement tool. Contributions welcome for:
- Additional data sources (state/local legislation)
- Enhanced impact analysis algorithms
- UI/UX improvements
- Accessibility features

## License

MIT License - Built for civic engagement and government transparency.