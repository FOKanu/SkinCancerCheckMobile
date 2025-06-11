import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import ScanScreen from './screens/ScanScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProgressScreen from './screens/ProgressScreen';
import EducationScreen from './screens/EducationScreen';
import LoginScreen from './screens/LoginScreen';
import TutorialScreen from './screens/TutorialScreen';
import { getCurrentUser, subscribeToAuthState } from './services/AuthService';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('home');

  const navItems = [
    { id: 'home', icon: 'home', label: 'Home', screen: 'Home' },
    { id: 'scan', icon: 'camera', label: 'Scan', screen: 'Scan' },
    { id: 'history', icon: 'time', label: 'History', screen: 'History' },
    { id: 'progress', icon: 'trending-up', label: 'Progress', screen: 'Progress' },
    { id: 'education', icon: 'book', label: 'Learn', screen: 'Education' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skin Cancer Check</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back!</Text>
          <Text style={styles.cardSubtitle}>Track your skin health journey</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.buttonText}>Start New Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {/* Alert Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Alert', 'This is your alert action!');
              // Or navigation.navigate('Alert');
            }}
          >
            <Ionicons name="alert-circle" size={24} color="#e74c3c" />
            <Text style={styles.actionText}>Alert</Text>
          </TouchableOpacity>

          {/* AI Powered Tips Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('AI Powered Tips', 'Here are your AI-powered health tips!');
              // Or navigation.navigate('AITips');
            }}
          >
            <Ionicons name="bulb" size={24} color="#f1c40f" />
            <Text style={styles.actionText}>AI Tips</Text>
          </TouchableOpacity>

          {/* Appointment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Appointment', 'Here you can schedule an appointment!');
              // Or navigation.navigate('Appointment');
            }}
          >
            <Ionicons name="calendar" size={24} color="#3498db" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Scans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <View style={styles.card}>
            <Text style={styles.emptyText}>No recent scans</Text>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.buttonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navigation}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, selectedTab === item.id && styles.selectedNavItem]}
            onPress={() => {
              setSelectedTab(item.id);
              navigation.navigate(item.screen);
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={selectedTab === item.id ? '#3498db' : '#7f8c8d'}
            />
            <Text style={[
              styles.navText,
              selectedTab === item.id && styles.selectedNavText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState((isAuth, user) => {
      console.log('Auth state changed:', isAuth, user);
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setShowTutorial(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      if (user) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    color: '#2c3e50',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  emptyText: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 12,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#3498db',
  },
  navText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  selectedNavText: {
    color: '#3498db',
  },
});
