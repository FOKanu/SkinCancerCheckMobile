import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, SafeAreaView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzePrediction } from '../services/PredictionService';
import { ImagePickerService } from '../services/ImagePickerService';

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
    try {
      const uri = await ImagePickerService.pickImageFromGallery();
      if (uri) {
        setImageUri(uri);
        logImageDimensions(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image from gallery. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const takePhoto = async () => {
    try {
      const uri = await ImagePickerService.takePhotoWithCamera();
      if (uri) {
        setImageUri(uri);
        logImageDimensions(uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        'Error',
        'Failed to take photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) return;

    setLoading(true);
    try {
      console.log('Starting image analysis for:', imageUri);

      // Validate image before analysis
      const isValid = await ImagePickerService.validateImageUri(imageUri);
      if (!isValid) {
        throw new Error('Invalid image file. Please try selecting a different image.');
      }

      const result = await analyzePrediction(imageUri);
      console.log('Analysis completed successfully:', result);
      navigation.navigate('Results', { result, imageUri });
    } catch (error) {
      console.error('Image analysis failed:', error);
      Alert.alert(
        'Analysis Failed',
        `Failed to analyze image: ${error.message || 'Unknown error occurred'}`,
        [{ text: 'OK' }]
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

        {Platform.OS === 'ios' && (
          <Text style={styles.iosNote}>
            💡 Tip: For best results on iOS, ensure you have granted camera and photo library permissions.
          </Text>
        )}
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
  iosNote: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20
  },
});
