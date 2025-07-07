import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { subscribeToAuthState, isInDemoMode } from './services/AuthService';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TutorialScreen from './screens/TutorialScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProgressScreen from './screens/ProgressScreen';
import EducationScreen from './screens/EducationScreen';
import AlertScreen from './screens/AlertScreen';
import AITipsScreen from './screens/AITipsScreen';
import ScheduleScreen from './screens/ScheduleScreen';

const Stack = createStackNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App.js: Starting auth state initialization');

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState((isAuth, user) => {
      console.log('Auth state changed:', { isAuth, user, isDemoMode: isInDemoMode() });
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    });

    // Add a timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('App.js: Auth state timeout - proceeding to login screen');
      setIsLoading(false);
      setIsAuthenticated(false);
    }, 3000); // 3 second timeout

    // Cleanup function
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading SkinCheckAI...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Scan" component={ScanScreen} />
              <Stack.Screen name="Results" component={ResultsScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Progress" component={ProgressScreen} />
              <Stack.Screen name="Education" component={EducationScreen} />
              <Stack.Screen name="Alert" component={AlertScreen} />
              <Stack.Screen name="AITips" component={AITipsScreen} />
              <Stack.Screen name="Schedule" component={ScheduleScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
});
