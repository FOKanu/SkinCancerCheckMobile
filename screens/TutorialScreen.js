import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const steps = [
  {
    title: "Welcome to SkinCheckAI",
    content: "Your AI-powered skin health companion. Let's walk you through how to use the app safely and effectively.",
    icon: 'medkit',
  },
  {
    title: "Important Disclaimer",
    content: "This app is NOT a replacement for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.",
    icon: 'warning',
  },
  {
    title: "How It Works",
    content: "Take clear photos of skin areas you want to check. Ensure good lighting and focus. The app will analyze the image and provide a preliminary assessment using advanced AI models.",
    icon: 'camera',
  },
  {
    title: "Confidence Levels",
    content: "If the app detects potential concerns with a confidence level above 55%, please consult a physician immediately. Early detection is crucial for successful treatment.",
    icon: 'alert-circle',
  },
  {
    title: "Regular Check-ups",
    content: "Continue with regular professional skin checks. This app is meant to complement, not replace, professional medical care.",
    icon: 'calendar',
  },
  {
    title: "Your Privacy",
    content: "Your images and data are securely stored and never shared without your consent. You can delete your data at any time from the app settings.",
    icon: 'lock-closed',
  },
];

export default function TutorialScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed, navigate to Home
      handleTutorialComplete();
    }
  };

  const handleSkip = () => {
    // Skip tutorial and go to Home
    handleTutorialComplete();
  };

  const handleTutorialComplete = () => {
    console.log('TutorialScreen: Tutorial completed, navigating to Home');
    // Navigate to Home screen and replace the current screen
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.stepContainer}>
          <Ionicons
            name={steps[currentStep].icon}
            size={64}
            color="#3498db"
            style={styles.icon}
          />
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.content}>{steps[currentStep].content}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentStep && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  stepContainer: { alignItems: 'center', width: width * 0.9, backgroundColor: '#fff', borderRadius: 20, padding: 24, marginVertical: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  icon: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 16 },
  content: { fontSize: 18, color: '#7f8c8d', textAlign: 'center', lineHeight: 28 },
  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#bdc3c7', marginHorizontal: 4 },
  paginationDotActive: { backgroundColor: '#3498db', width: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  skipButton: { padding: 12 },
  skipButtonText: { color: '#7f8c8d', fontSize: 18 },
  nextButton: { backgroundColor: '#3498db', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
