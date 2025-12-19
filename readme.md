# Expense Tracker - React Native Expo App

A production-quality expense tracking mobile application built with React Native, Expo, and TypeScript. This app features a modern fintech-grade UI with complete backend integration architecture, providing users with comprehensive financial management capabilities.

## 📱 About the App

Expense Tracker is a full-featured mobile application designed to help users manage their personal finances efficiently. The app provides an intuitive interface for tracking expenses, organizing them by categories, and gaining insights through detailed statistics and analytics. Built with modern technologies and best practices, it seamlessly integrates with a backend API for data persistence and advanced features.

Whether you're tracking daily expenses, analyzing spending patterns, or managing multiple categories, Expense Tracker offers a complete solution with a polished user experience and robust architecture.

## 🚀 Key Features

### Authentication & Security
- **User Registration & Login**: Secure signup with email verification (OTP-based)
- **Password Management**: Forgot password and reset password flows with OTP verification
- **JWT Token Management**: Automatic token refresh with background refresh queue to maintain user sessions
- **Email Verification**: Required verification step for new accounts with resendable OTP
- **Guarded Routes**: Unverified users are restricted to the verification screen

### Expense Management
- **Create Expenses**: Add new expenses with amount, category, date, and optional description
- **View Expenses**: List all expenses with filtering and inline details
- **Edit Expenses**: Update expense details with real-time validation
- **Delete Expenses**: Remove expenses with confirmation
- **Category Assignment**: Assign expenses to multiple categories with category chips

### Category Management
- **Create Categories**: Define custom spending categories
- **Manage Categories**: View all categories with expense count
- **Edit Categories**: Update category details inline
- **Delete Categories**: Remove categories (with expense handling)
- **Category Insights**: View all expenses related to a specific category

### Analytics & Statistics
- **Pie Charts**: Visual breakdown of expenses by category using Victory Native charts
- **Monthly Trends**: Track spending patterns over time with trend analysis
- **Top Categories**: Identify highest spending categories with configurable limits
- **Expense Summary**: Aggregate statistics including total spending, average, min/max
- **Currency Formatting**: Automatic currency conversion and formatting helpers
- **Date Formatting**: Relative (e.g., "2 days ago") and long date formats

### User Profile Management
- **View Profile**: Display user information (name, email, date of birth, location)
- **Edit Profile**: Update personal information (first/last name, DOB, place of birth)
- **Profile Guarding**: Unverified users must verify email before accessing full profile features

### User Experience
- **Dark/Light Theme Support**: Full theme customization with system preference detection
- **Responsive UI Kit**: Reusable components (Button, Card, Input, EmptyState, SkeletonLoader)
- **Loading States**: Skeleton loaders for smooth data loading experiences
- **Error Handling**: Centralized API error normalization with user-friendly error messages
- **Optimistic UI**: Instant feedback for user actions while syncing with backend
- **File-based Navigation**: expo-router for seamless navigation with auth stacks and tab navigation

## 🔌 Backend API Integration

The app communicates with a backend API (expensesTrackerBackend) using a well-structured service layer. All API calls are typed and validated using TypeScript interfaces and Zod schemas.

### API Configuration
- **Base URL**: Configurable via environment variables (`src/config/env.ts`)
- **Client**: Axios with interceptors for authentication and token refresh
- **Authentication**: Bearer token in Authorization header
- **Response Format**: Standardized ApiResponse wrapper with status and data fields
- **Timeout**: 15 seconds per request

### API Service Architecture

**Axios Client Configuration:**
- Base URL: From environment config
- Timeout: 15 seconds
- Default headers: `Content-Type: application/json`

**Request Interceptor:**
- Automatically attaches JWT access token from AsyncStorage to Authorization header
- Logs outgoing requests in development mode with method, URL, and data

**Response Interceptor:**
- Logs successful responses in development mode
- Handles 401 unauthorized responses with automatic token refresh
- Implements refresh token queue to prevent multiple simultaneous refresh requests
- Retries failed requests after successful token refresh

**Error Handling:**
- Centralized error normalization with `apiError` utility
- Provides consistent error messages across all screens
- Returns structured error objects with optional validation details

### API Endpoints

#### Authentication Endpoints (`POST /api/v1/users/*`)

**POST /users/signin**
- Login with email and password
- Request: `{ email: string, password: string }`
- Response: User object + accessToken + refreshToken
- Usage: Initial user login

**POST /users/signup**
- Register new user account
- Request: `{ firstName: string, lastName: string, email: string, password: string, dateOfBirth: string, placeOfBirth: string }`
- Response: User object + accessToken + refreshToken
- Usage: New account creation

**POST /users/logout**
- Logout user and invalidate tokens
- Response: Success message
- Usage: Clear user session

**POST /users/refresh-token**
- Refresh access token using refresh token
- Request: `{ refreshToken: string }`
- Response: New accessToken + refreshToken
- Usage: Automatic token refresh on 401 errors

**POST /users/verify/request**
- Request email verification OTP
- Request: `{ email: string }`
- Response: Message + optional OTP (for development)
- Usage: Start email verification process

**POST /users/verify/confirm**
- Confirm email with OTP code
- Request: `{ email: string, otp: string }`
- Response: Confirmation message
- Usage: Complete email verification

**POST /users/password/forgot**
- Request password reset OTP
- Request: `{ email: string }`
- Response: Message + optional OTP (for development)
- Usage: Initiate password reset flow

**POST /users/password/reset**
- Reset password with OTP verification
- Request: `{ email: string, otp: string, newPassword: string }`
- Response: Confirmation message
- Usage: Complete password reset

**PUT /users/profile**
- Update user profile information
- Request: Partial update with optional `firstName`, `lastName`, `dateOfBirth`, `placeOfBirth`
- Response: Updated user object
- Usage: Profile editing after login

#### Expense Endpoints (`/api/v1/expenses`)

**GET /expenses**
- Fetch all expenses for the logged-in user
- Response: Array of expense objects
- Usage: Populate expense list screen

**GET /expenses/:id**
- Get a specific expense by ID
- Response: Single expense object with full details
- Usage: View expense details

**POST /expenses**
- Create a new expense
- Request: `{ amount: number, categoryId: string, date: string, description?: string }`
- Response: Created expense object
- Usage: Add new expense entry

**PUT /expenses/:id**
- Update an existing expense
- Request: Partial update with any expense fields
- Response: Updated expense object
- Usage: Edit existing expense

**DELETE /expenses/:id**
- Delete an expense permanently
- Response: Success message
- Usage: Remove expense entry

#### Category Endpoints (`/api/v1/categories`)

**GET /categories**
- Fetch all categories for the user
- Response: Array of category objects
- Usage: Populate category list and dropdown selectors

**GET /categories/:id**
- Get a specific category by ID
- Response: Single category object
- Usage: View category details and related expenses

**POST /categories**
- Create a new expense category
- Request: `{ name: string, color?: string, icon?: string }`
- Response: Created category object
- Usage: Create custom spending categories

**PUT /categories/:id**
- Update a category
- Request: Partial update with any category fields (name, color, icon)
- Response: Updated category object
- Usage: Edit category details

**DELETE /categories/:id**
- Delete a category
- Response: Success message
- Usage: Remove unused categories

#### Statistics Endpoints (`/api/v1/statistics`)

**GET /statistics/by-category**
- Get expenses breakdown by category
- Response: Array of CategoryExpense objects with total amount and count per category
- Usage: Pie chart data and category breakdown view

**GET /statistics/monthly-trends**
- Get monthly spending trends over time
- Response: Array of MonthlyTrend objects with month and total amount
- Usage: Trend analysis and historical spending patterns

**GET /statistics/top-categories**
- Get top spending categories ranked by amount
- Query Params: `limit` (optional, default: 5)
- Response: Array of TopCategory objects with rank, name, and amount
- Usage: Show user's most expensive categories

**GET /statistics/summary**
- Get overall expense summary and aggregate statistics
- Response: ExpenseSummary object with total, average, min, max, count
- Usage: Dashboard summary card and financial overview

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build management
- **TypeScript**: Type-safe development
- **expo-router**: File-based navigation
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Data Management & API
- **Axios**: HTTP client with interceptors
- **React Query (@tanstack/react-query)**: Server state management and caching
- **AsyncStorage**: Local persistent storage for tokens
- **jwt-decode**: JWT token parsing

### UI & Visualization
- **Victory Native**: Chart and statistics visualization
- **Lucide React Native**: Icon library
- **Shopify React Native Skia**: Advanced graphics
- **React Native Reanimated**: Smooth animations

### Utilities
- **React Native DateTimePicker**: Date selection component
- **React Native Country Picker**: Country selection
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Linking**: Deep linking support

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Backend server running (API base URL configured in environment)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies
```bash
cd expense-tracker
npm install
# or
yarn install
```

### 2. Configure Environment Variables
Create or update `src/config/env.ts` with your backend API configuration:

```typescript
export const config = {
  API_BASE_URL: 'http://your-backend-url.com/api/v1',
  NODE_ENV: 'development', // or 'production'
};
```

### 3. Install Expo CLI
```bash
npm install -g expo-cli
```

### 4. Start Development Server
```bash
npm start
# or
yarn start
```

This will display a QR code. You can:
- Press `i` to open in iOS Simulator (macOS only)
- Press `a` to open in Android Emulator
- Scan QR code with Expo Go app for physical device testing

### 5. Available Commands
```bash
npm start     # Start development server
npm run ios   # Run on iOS Simulator
npm run android # Run on Android Emulator
npm run web   # Run on web browser
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── charts/         # Chart components (PieChart)
│   ├── expense/        # Expense-specific components
│   └── ui/             # UI kit components (Button, Card, Input, etc.)
├── config/             # Configuration files (env, API config)
├── hooks/              # Custom React hooks
│   ├── authHooks/      # Authentication hooks
│   ├── categoryHooks/  # Category management hooks
│   ├── expenseHooks/   # Expense management hooks
│   ├── statHooks/      # Statistics hooks
│   └── themeHooks/     # Theme management hooks
├── services/           # API service layer
│   ├── api.ts          # Axios instance with interceptors
│   ├── endpoints.ts    # Typed API endpoint definitions
│   └── mock-data.ts    # Mock data for development
├── theme/              # Theme configuration
│   ├── theme.ts        # Theme definitions
│   ├── spacing.ts      # Spacing constants
│   └── typography.ts   # Typography configuration
├── types/              # TypeScript type definitions
│   ├── api.types.ts    # API response types
│   ├── expense.types.ts # Expense/Category types
│   └── statistics.types.ts # Statistics types
└── utils/              # Utility functions
    ├── apiError.ts     # Error handling utilities
    ├── currency.ts     # Currency formatting
    └── date.ts         # Date utilities

app/                     # Expo Router pages (file-based routing)
├── (auth)/             # Authentication stack
├── (tabs)/             # Tabbed interface
├── category/           # Category management pages
└── expense/            # Expense management pages
```

## 🔐 Security Features

- **JWT Authentication**: Access and refresh token management
- **Automatic Token Refresh**: Seamless background token refresh on expiration
- **Token Storage**: Secure AsyncStorage for token persistence
- **Request Interceptors**: Automatic authorization header injection
- **Email Verification**: OTP-based email verification for new accounts
- **Password Reset**: Secure password reset with OTP verification
- **Route Guards**: Protected routes for unverified users

## 🎨 Theming & Customization

The app includes full theme support:
- Light and dark mode
- Customizable colors, spacing, and typography
- Consistent design system across all screens
- Theme persistence to local storage
- System preference detection

## 📊 Data Caching Strategy

Using React Query for intelligent caching:
- Automatic cache invalidation
- Background refetching
- Optimistic updates
- Stale-while-revalidate pattern
- Error retry logic

## 🚀 Deployment

The app is built for both iOS and Android using Expo's build system:

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build
```

See [eas.json](eas.json) for build configuration.

## 📝 License

This project is part of the Expense Tracker suite. See individual component documentation for specific details.

## 💡 Development Notes

- Uses TypeScript for type safety
- Follows React and React Native best practices
- Implements proper error handling and user feedback
- Supports offline-first architecture with optimistic updates
- Ready for Expo's managed workflow and EAS Build
