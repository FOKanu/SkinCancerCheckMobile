# Development Guide

## Overview

This guide provides comprehensive information for developers contributing to the Skin Cancer Check Mobile App project.

## Development Environment Setup

### Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   # Check version
   node --version
   npm --version
   ```

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **Development Tools**
   - **iOS**: Xcode (Mac only)
   - **Android**: Android Studio
   - **Web**: Any modern browser

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/FOKanu/SkinCancerCheckMobile.git
   cd SkinCancerCheckMobile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Database Setup**
   ```bash
   node initDb.js
   ```

## Project Structure

### Directory Organization

```
SkinCancerCheckMobile/
├── assets/                 # Static assets
│   ├── images/            # Image files
│   ├── icons/             # Icon files
│   └── fonts/             # Custom fonts
├── components/            # Reusable components
│   ├── common/           # Shared components
│   ├── forms/            # Form components
│   └── navigation/       # Navigation components
├── screens/              # Screen components
│   ├── auth/            # Authentication screens
│   ├── main/            # Main app screens
│   └── modals/          # Modal screens
├── services/             # Business logic
│   ├── api/             # API services
│   ├── auth/            # Authentication
│   ├── database/        # Database operations
│   └── utils/           # Utility functions
├── navigation/           # Navigation configuration
├── constants/            # App constants
├── hooks/               # Custom React hooks
├── types/               # TypeScript types (if using TS)
└── docs/                # Documentation
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `ScanScreen.js`)
- **Services**: camelCase (e.g., `apiService.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.js`)

## Coding Standards

### JavaScript/React Native

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// PropTypes (if not using TypeScript)
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render
  return (
    <View style={styles.container}>
      <Text>{prop1}</Text>
    </View>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default ComponentName;
```

#### Style Guidelines
```javascript
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Text styles
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Component-specific styles
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
  },
});
```

### Error Handling

#### API Calls
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await apiService.getData();
    setData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### Component Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## State Management

### Local State
```javascript
const [state, setState] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Global State (if needed)
```javascript
// Using Context API
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = {
    user,
    setUser,
    theme,
    setTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

## API Integration

### Service Pattern
```javascript
// services/apiService.js
class ApiService {
  constructor() {
    this.baseURL = process.env.SCORING_API_URL;
  }

  async predictSkinLesion(imageUri) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${this.baseURL}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
```

### Custom Hooks for API
```javascript
// hooks/useApi.js
import { useState, useCallback } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};
```

## Testing

### Unit Testing
```javascript
// __tests__/components/ScanScreen.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScanScreen from '../../screens/ScanScreen';

describe('ScanScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ScanScreen />);
    expect(getByText('Scan or Upload')).toBeTruthy();
  });

  it('handles image selection', async () => {
    const { getByText } = render(<ScanScreen />);
    const button = getByText('Gallery');

    fireEvent.press(button);
    // Add assertions for image selection
  });
});
```

### Integration Testing
```javascript
// __tests__/integration/api.test.js
import apiService from '../../services/apiService';

describe('API Service', () => {
  it('predicts skin lesion correctly', async () => {
    const mockImageUri = 'file://test-image.jpg';
    const result = await apiService.predictSkinLesion(mockImageUri);

    expect(result).toHaveProperty('prediction');
    expect(result).toHaveProperty('confidence');
  });
});
```

## Performance Optimization

### Image Optimization
```javascript
// Optimize images before upload
const optimizeImage = async (imageUri) => {
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 224, height: 224 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};
```

### Lazy Loading
```javascript
// Lazy load components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);
```

### Memory Management
```javascript
// Clean up resources
useEffect(() => {
  const subscription = someService.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Debugging

### Development Tools
```javascript
// Enable debugging
if (__DEV__) {
  console.log('Debug info:', data);
}

// React Native Debugger
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning:']); // Ignore specific warnings
```

### Error Tracking
```javascript
// Sentry integration
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: __DEV__ ? 'development' : 'production',
});

// Capture errors
try {
  // Risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `refactor/component-name` - Code refactoring

### Commit Messages
```
feat: add new scan functionality
fix: resolve image upload issue
docs: update API documentation
style: improve button styling
refactor: simplify authentication logic
test: add unit tests for ScanScreen
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Code review
6. Merge to main

## Common Patterns

### Form Handling
```javascript
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    // Validation logic
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
};
```

### Navigation Patterns
```javascript
// Navigation service
import { navigationRef } from '../navigation/RootNavigation';

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

// Screen navigation
const Screen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('NextScreen', { data: 'value' });
  };
};
```

## Best Practices

### Code Organization
1. Keep components small and focused
2. Extract reusable logic into hooks
3. Use consistent naming conventions
4. Group related files together

### Performance
1. Use `useMemo` and `useCallback` appropriately
2. Avoid unnecessary re-renders
3. Optimize images and assets
4. Implement proper loading states

### Security
1. Never store sensitive data in client
2. Validate all inputs
3. Use HTTPS for all API calls
4. Implement proper authentication

### Accessibility
1. Add proper labels and descriptions
2. Support screen readers
3. Use semantic markup
4. Test with accessibility tools

## Troubleshooting

### Common Issues

1. **Metro Bundler Issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependency Conflicts**
   ```bash
   npm install --force
   ```

3. **iOS Build Issues**
   ```bash
   cd ios && pod install
   ```

4. **Android Build Issues**
   ```bash
   cd android && ./gradlew clean
   ```

### Debug Commands
```bash
# Check environment
echo $NODE_ENV

# Clear caches
npm start -- --reset-cache

# Check dependencies
npm audit

# Update dependencies
npm update
```

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://github.com/infinitered/reactotron)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
