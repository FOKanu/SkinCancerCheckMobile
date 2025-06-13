import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPredictionHistory } from '../services/PredictionService';
import { getCurrentUser } from '../services/AuthService';

export default function AlertScreen({ navigation }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        const history = await getPredictionHistory(currentUser?.id);

        // Process history to create alerts
        const processedAlerts = processAlerts(history);
        setAlerts(processedAlerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const processAlerts = (history) => {
    const alerts = [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Group history by spot
    const spots = {};
    history.forEach(item => {
      if (!spots[item.spot_id]) {
        spots[item.spot_id] = [];
      }
      spots[item.spot_id].push(item);
    });

    // Process each spot
    Object.entries(spots).forEach(([spotId, spotHistory]) => {
      // Sort by date
      spotHistory.sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at));
      const lastScan = spotHistory[0];

      // Check if rescan is needed
      if (new Date(lastScan.scanned_at) < twoWeeksAgo) {
        alerts.push({
          id: `rescan-${spotId}`,
          type: 'rescan',
          title: 'Rescan Required',
          description: 'It\'s been more than two weeks since your last scan of this spot.',
          date: lastScan.scanned_at,
          severity: 'medium',
          spotId: spotId,
        });
      }

      // Check for anomalies (if there are multiple scans)
      if (spotHistory.length > 1) {
        const previousScan = spotHistory[1];
        if (lastScan.prediction !== previousScan.prediction) {
          alerts.push({
            id: `anomaly-${spotId}`,
            type: 'anomaly',
            title: 'Change Detected',
            description: 'The prediction for this spot has changed since the last scan.',
            date: lastScan.scanned_at,
            severity: 'high',
            spotId: spotId,
          });
        }
      }
    });

    return alerts.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Alerts & Reminders</Text>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter" size={24} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  );

  const renderAlertCard = (alert) => {
    const getSeverityColor = (severity) => {
      switch (severity) {
        case 'high':
          return '#e74c3c';
        case 'medium':
          return '#f1c40f';
        case 'low':
          return '#3498db';
        default:
          return '#7f8c8d';
      }
    };

    const getIcon = (type) => {
      switch (type) {
        case 'rescan':
          return 'time';
        case 'anomaly':
          return 'alert-circle';
        default:
          return 'information-circle';
      }
    };

    return (
      <TouchableOpacity
        key={alert.id}
        style={styles.alertCard}
        onPress={() => navigation.navigate('Scan')}
      >
        <View style={[styles.iconContainer, { backgroundColor: getSeverityColor(alert.severity) + '20' }]}>
          <Ionicons name={getIcon(alert.type)} size={24} color={getSeverityColor(alert.severity)} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertDescription}>{alert.description}</Text>
          <Text style={styles.alertDate}>
            {new Date(alert.date).toLocaleDateString()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#2ecc71" />
            <Text style={styles.emptyText}>No alerts at this time</Text>
            <Text style={styles.emptySubtext}>
              Your skin spots are up to date with regular scans
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              {alerts.map(renderAlertCard)}
            </View>

            <View style={styles.infoSection}>
              <Ionicons name="information-circle" size={24} color="#3498db" />
              <Text style={styles.infoText}>
                Regular skin checks are recommended every two weeks. Keep track of any changes in your skin lesions.
              </Text>
            </View>
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});
