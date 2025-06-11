import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPredictionHistory } from '../services/PredictionService';
import { getCurrentUser } from '../services/AuthService';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const currentUser = getCurrentUser();
      const data = await getPredictionHistory(currentUser?.id);
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Scan History</Text>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter" size={24} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  );

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

  if (!history || history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>No scan history found</Text>
          <TouchableOpacity
            style={styles.newScanButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.newScanButtonText}>Start New Scan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={history}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Results', { result: item, imageUri: item.image_url })}
          >
            <Image source={{ uri: item.image_url }} style={styles.preview} />
            <View style={styles.cardContent}>
              <View style={styles.predictionContainer}>
                <Text style={styles.predictionLabel}>Prediction:</Text>
                <Text style={[
                  styles.prediction,
                  { color: item.prediction === 'malignant' ? '#e74c3c' : '#2ecc71' }
                ]}>
                  {item.prediction?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.confidence}>Confidence: {(item.confidence * 100).toFixed(2)}%</Text>
                <Text style={styles.date}>{new Date(item.scanned_at).toLocaleString()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 24,
  },
  newScanButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newScanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8,
  },
  prediction: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidence: {
    fontSize: 14,
    color: '#2c3e50',
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
