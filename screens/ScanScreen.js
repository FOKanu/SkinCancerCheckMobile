import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, SafeAreaView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { analyzePrediction } from '../services/PredictionService';

export default function ScanScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const logImageDimensions = (uri) => {
    Image.getSize(uri, (width, height) => {
      console.log('Cropped image dimensions:', { width, height });
    }, (error) => {
      console.error('Error getting image dimensions:', error);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      outputSize: { width: 224, height: 224 }
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      logImageDimensions(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      outputSize: { width: 224, height: 224 }
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      logImageDimensions(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);
    try {
      console.log('Starting image analysis for:', imageUri);
      const result = await analyzePrediction(imageUri);
      console.log('Analysis completed successfully:', result);
      navigation.navigate('Results', { result, imageUri });
    } catch (error) {
      console.error('Image analysis failed:', error);
      Alert.alert(
        'Analysis Failed',
        `Failed to analyze image: ${error.message || 'Unknown error occurred'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan or Upload a Skin Lesion Image</Text>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={24} color="#fff" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.analyzeButton, !imageUri && { backgroundColor: '#ccc' }]}
          onPress={analyzeImage}
          disabled={!imageUri || loading}
        >
          <Text style={styles.analyzeButtonText}>{loading ? 'Analyzing...' : 'Analyze'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  preview: { width: 250, height: 250, borderRadius: 12, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', marginBottom: 20 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', padding: 12, borderRadius: 8, marginHorizontal: 10 },
  buttonText: { color: '#fff', marginLeft: 8, fontSize: 16 },
  analyzeButton: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 8, alignItems: 'center', width: 200 },
  analyzeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
