# Expense Tracker - React Native Expo App

A production-quality expense tracking mobile application built with React Native, Expo, and TypeScript. This app features a modern fintech-grade UI with complete backend integration architecture.

## 🚀 Features

- **Authentication suite**: Register, email verification, login, forgot/reset password, JWT refresh with automatic token rotation
- **Profile management**: View/update profile (name, dob, country) with guarded routes for unverified users
- **Expense CRUD**: Create, read, update, delete expenses; inline edit modal with category chips and validation
- **Category CRUD**: Create, read, update, delete categories with inline edit modal and related expenses view
- **Statistics & insights**: Pie chart breakdowns, relative/long date formatting, currency formatting helpers
- **Error handling UX**: Centralized API error normalization with consistent alerts across screens
- **Theming**: Full light/dark theme support and reusable UI kit (Button, Card, Input, EmptyState, Skeletons)
- **Data layer**: React Query caching, optimistic UI patterns, and Axios API client with endpoints abstraction
- **Navigation**: expo-router file-based navigation with tabs, auth stack, and guarded screens
- **Ready for backend**: Configurable API base URL, typed DTOs, and mock data for offline/local development

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## 🛠️ Installation

1. **Create the Expo project:**
   ```bash
   npx create-expo-app@latest expense-tracker --template blank-typescript
   cd expense-tracker
   ```
