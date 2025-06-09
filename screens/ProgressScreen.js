import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPredictionHistory } from '../services/PredictionService';

export default function ProgressScreen() {
  const [stats, setStats] = useState({
    totalScans: 0,
    benignCount: 0,
    malignantCount: 0,
    averageConfidence: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const history = await getPredictionHistory();
      const totalScans = history.length;
      const benignCount = history.filter(item => item.prediction === 'benign').length;
      const malignantCount = history.filter(item => item.prediction === 'malignant').length;
      const averageConfidence = history.reduce((acc, item) => acc + item.confidence, 0) / totalScans || 0;

      setStats({
        totalScans,
        benignCount,
        malignantCount,
        averageConfidence,
      });
    };

    fetchStats();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Progress & Statistics</Text>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="calendar" size={24} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  );

  const renderStatCard = (title, value, icon, color) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'Total Scans',
            stats.totalScans,
            'scan',
            '#3498db'
          )}
          {renderStatCard(
            'Benign Results',
            stats.benignCount,
            'checkmark-circle',
            '#2ecc71'
          )}
          {renderStatCard(
            'Malignant Results',
            stats.malignantCount,
            'alert-circle',
            '#e74c3c'
          )}
          {renderStatCard(
            'Avg. Confidence',
            `${(stats.averageConfidence * 100).toFixed(1)}%`,
            'trending-up',
            '#f1c40f'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="bar-chart" size={48} color="#bdc3c7" />
            <Text style={styles.placeholderText}>Monthly statistics chart coming soon</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.recommendationCard}>
            <Ionicons name="information-circle" size={24} color="#3498db" />
            <Text style={styles.recommendationText}>
              Regular skin checks are recommended every 3-6 months. Keep track of any changes in your skin lesions.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
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
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    marginTop: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationText: {
    flex: 1,
    marginLeft: 12,
    color: '#2c3e50',
    fontSize: 14,
    lineHeight: 20,
  },
});
