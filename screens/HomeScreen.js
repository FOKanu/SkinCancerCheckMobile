import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
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
        <Image source={require('../assets/Skin_check_ai_logo_transparent.png')} style={styles.logo} />
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
            onPress={() => navigation.navigate('Alert')}
          >
            <Ionicons name="alert-circle" size={24} color="#e74c3c" />
            <Text style={styles.actionText}>Alert</Text>
          </TouchableOpacity>

          {/* AI Powered Tips Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AITips')}
          >
            <Ionicons name="bulb" size={24} color="#f1c40f" />
            <Text style={styles.actionText}>AI Tips</Text>
          </TouchableOpacity>

          {/* Appointment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Schedule')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  logo: {
    width: 90,
    height: 45,
    resizeMode: 'contain',
  },
  profileButton: {
    padding: 4,
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedNavItem: {
    backgroundColor: '#f8f9fa',
  },
  navText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  selectedNavText: {
    color: '#3498db',
    fontWeight: '600',
  },
});
