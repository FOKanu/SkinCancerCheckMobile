# Deployment Guide

## Overview

This guide covers deploying the Skin Cancer Check Mobile App to various platforms including development, staging, and production environments.

## Prerequisites

### Development Environment
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git

### Production Environment
- Expo account
- Apple Developer account (for iOS)
- Google Play Console account (for Android)
- Supabase project
- ML API service

## Environment Configuration

### 1. Development Environment

Create a `.env` file for development:
```env
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_ANON_KEY=your-dev-anon-key
SCORING_API_URL=https://model-inference-api-521423942017.europe-west1.run.app
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true
```

### 2. Staging Environment

Create a `.env.staging` file:
```env
SUPABASE_URL=https://your-staging-project.supabase.co
SUPABASE_ANON_KEY=your-staging-anon-key
SCORING_API_URL=https://model-inference-api-521423942017.europe-west1.run.app
EXPO_PUBLIC_APP_ENV=staging
EXPO_PUBLIC_DEBUG_MODE=false
```

### 3. Production Environment

Create a `.env.production` file:
```env
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
SCORING_API_URL=https://model-inference-api-521423942017.europe-west1.run.app
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_DEBUG_MODE=false
```

## Database Setup

### 1. Supabase Project Setup

1. Create a new Supabase project
2. Enable required services:
   - Authentication
   - Database
   - Storage
   - Edge Functions (if needed)

### 2. Database Initialization

Run the database initialization script:
```bash
node initDb.js
```

This will create:
- Users table
- Scans table
- Spots table
- Skin care tips table
- Products table

### 3. Storage Bucket Setup

Create a storage bucket for images:
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesion-images', 'lesion-images', true);

-- Set up RLS policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'lesion-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lesion-images' AND auth.role() = 'authenticated');
```

## Development Deployment

### 1. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### 2. Expo Development Build

```bash
# Create development build
expo build:development

# Install on device
expo install:ios
expo install:android
```

## Staging Deployment

### 1. Build Staging Version

```bash
# Set environment
export EXPO_ENV=staging

# Build for staging
expo build:ios --configuration Release
expo build:android --configuration Release
```

### 2. Internal Testing

- Upload to TestFlight (iOS)
- Upload to Internal Testing (Android)
- Distribute to internal testers

## Production Deployment

### 1. iOS App Store Deployment

#### Prerequisites
- Apple Developer account
- App Store Connect access
- App signing certificates

#### Build Process
```bash
# Build for production
expo build:ios --configuration Release

# Or use EAS Build
eas build --platform ios --profile production
```

#### App Store Submission
1. Archive the build in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

#### App Store Configuration
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.skincancercheck",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to capture skin lesion images for analysis.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photo library to select skin lesion images for analysis."
      }
    }
  }
}
```

### 2. Android Play Store Deployment

#### Prerequisites
- Google Play Console account
- App signing key
- Privacy policy

#### Build Process
```bash
# Build for production
expo build:android --configuration Release

# Or use EAS Build
eas build --platform android --profile production
```

#### Play Store Submission
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure app metadata
4. Submit for review

#### Play Store Configuration
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.skincancercheck",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### 3. Web Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify Deployment
```bash
# Build for web
expo build:web

# Deploy to Netlify
netlify deploy --prod --dir=web-build
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build:staging
      - run: npm run deploy:staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build:production
      - run: npm run deploy:production
```

### EAS Build

Configure `eas.json`:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Monitoring and Analytics

### 1. Error Tracking

#### Sentry Integration
```bash
npm install @sentry/react-native
```

Configure in `App.js`:
```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.EXPO_PUBLIC_APP_ENV,
});
```

### 2. Analytics

#### Firebase Analytics
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

### 3. Performance Monitoring

#### Firebase Performance
```bash
npm install @react-native-firebase/perf
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure key management services
- Rotate API keys regularly

### 2. API Security
- Implement rate limiting
- Use HTTPS for all communications
- Validate all inputs
- Implement proper authentication

### 3. Data Protection
- Encrypt sensitive data
- Implement proper backup strategies
- Follow GDPR/CCPA compliance
- Regular security audits

## Rollback Strategy

### 1. Database Rollback
```sql
-- Create backup before deployment
pg_dump your_database > backup.sql

-- Rollback if needed
psql your_database < backup.sql
```

### 2. App Rollback
- Keep previous app versions in stores
- Use feature flags for gradual rollouts
- Monitor crash reports and user feedback

## Performance Optimization

### 1. Build Optimization
- Enable Hermes engine
- Use ProGuard for Android
- Optimize bundle size

### 2. Runtime Optimization
- Implement lazy loading
- Use image compression
- Optimize database queries
- Implement caching strategies

## Testing Strategy

### 1. Automated Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### 2. Manual Testing
- Test on multiple devices
- Test different network conditions
- Test edge cases and error scenarios

## Support and Maintenance

### 1. Monitoring
- Set up alerts for critical errors
- Monitor API response times
- Track user engagement metrics

### 2. Updates
- Regular dependency updates
- Security patches
- Feature updates

### 3. Documentation
- Keep deployment docs updated
- Document configuration changes
- Maintain runbooks for common issues
