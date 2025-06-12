import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { savePredictionToSupabase, createSpot } from '../services/PredictionService';
import { getCurrentUser } from '../services/AuthService';
import { getDisplayLabel } from '../services/ApiService';

export default function ResultsScreen({ route, navigation }) {
  const { result, imageUri } = route.params || {};
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const handleSaveToNewSpot = async () => {
    setIsSaving(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.error("User not logged in. Cannot save prediction.");
        Alert.alert('Error', 'Please log in to save your prediction history.');
        return;
      }
      const spot = await createSpot(currentUser.id);
      console.log('Spot created:', spot);
      if (spot && spot.id) {
        await savePredictionToSupabase(result, imageUri, spot.id);
        setSaveSuccess(true);
        setShowOptions(false);
      } else {
        console.error("Failed to create a new spot.", spot);
        Alert.alert('Error', 'Failed to save prediction due to spot creation issue.');
      }
    } catch (error) {
      console.error('Failed to save prediction:', error);
      Alert.alert('Error', 'Failed to save prediction');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkToExistingSpot = () => {
    navigation.navigate('SelectSpot', { result, imageUri });
  };

  useEffect(() => {
    if (route.params?.selectedSpotId) {
      const saveToSelectedSpot = async () => {
        setIsSaving(true);
        try {
          await savePredictionToSupabase(result, imageUri, route.params.selectedSpotId);
          setSaveSuccess(true);
          setShowOptions(false);
        } catch (error) {
          console.error('Failed to save prediction to existing spot:', error);
          Alert.alert('Error', 'Failed to save prediction to existing spot.');
        } finally {
          setIsSaving(false);
          navigation.setParams({ selectedSpotId: undefined });
        }
      };
      saveToSelectedSpot();
    }
  }, [route.params?.selectedSpotId]);

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No result to display.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prediction: <Text style={{ color: getDisplayLabel(result.prediction) === 'High Risk' ? '#e74c3c' : '#2ecc71' }}>{getDisplayLabel(result.prediction)}</Text></Text>
          <Text style={styles.confidence}>Confidence: {(result.confidence * 100).toFixed(2)}%</Text>
          <Text style={styles.probability}>Low Risk: {(result.probabilities.benign * 100).toFixed(2)}%</Text>
          <Text style={styles.probability}>High Risk: {(result.probabilities.malignant * 100).toFixed(2)}%</Text>
        </View>

        {showOptions ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, isSaving && styles.actionButtonDisabled]}
              onPress={handleSaveToNewSpot}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Save to New Spot</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, isSaving && styles.actionButtonDisabled]}
              onPress={handleLinkToExistingSpot}
              disabled={isSaving}
            >
              <Text style={styles.actionButtonText}>Link to Existing Spot</Text>
            </TouchableOpacity>
          </View>
        ) : (
          saveSuccess ? (
            <Text style={styles.successMessage}>Prediction saved successfully!</Text>
          ) : (
            <Text style={styles.errorMessage}>Failed to save prediction.</Text>
          )
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  backButton: { padding: 8 },
  placeholder: { width: 40 },
  content: { flex: 1, alignItems: 'center', padding: 20 },
  preview: { width: 250, height: 250, borderRadius: 12, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, width: '100%', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  confidence: { fontSize: 16, color: '#2c3e50', marginBottom: 8 },
  probability: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonDisabled: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
