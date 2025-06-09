import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { savePredictionToSupabase } from '../services/PredictionService';

export default function ResultsScreen({ route, navigation }) {
  const { result, imageUri } = route.params || {};
  const [saving, setSaving] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const autoSave = async () => {
      if (result && imageUri) {
        try {
          await savePredictionToSupabase(result, imageUri);
          setSaved(true);
        } catch (error) {
          Alert.alert('Error', 'Failed to save prediction');
        } finally {
          setSaving(false);
        }
      } else {
        setSaving(false);
      }
    };
    autoSave();
  }, [result, imageUri]);

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
          <Text style={styles.cardTitle}>Prediction: <Text style={{ color: result.prediction === 'malignant' ? '#e74c3c' : '#2ecc71' }}>{result.prediction.toUpperCase()}</Text></Text>
          <Text style={styles.confidence}>Confidence: {(result.confidence * 100).toFixed(2)}%</Text>
          <Text style={styles.probability}>Benign: {(result.probabilities.benign * 100).toFixed(2)}%</Text>
          <Text style={styles.probability}>Malignant: {(result.probabilities.malignant * 100).toFixed(2)}%</Text>
        </View>
        {saving && <Text style={styles.savingText}>Saving to history...</Text>}
        {saved && <Text style={styles.savedText}>Saved to history!</Text>}
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
  savingText: { color: '#3498db', fontSize: 16, marginTop: 10 },
  savedText: { color: '#2ecc71', fontSize: 16, marginTop: 10 },
});
