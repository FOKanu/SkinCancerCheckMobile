import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TutorialModal({ visible, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Skin Check AI',
      content: 'This app helps you monitor your skin health using AI-powered analysis. Let\'s go through some important information.',
      icon: 'medkit',
    },
    {
      title: 'Important Disclaimer',
      content: 'This app is NOT a replacement for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.',
      icon: 'warning',
    },
    {
      title: 'Confidence Levels',
      content: 'If the app detects potential cancer with a confidence level above 55%, please consult a physician immediately. Early detection is crucial for successful treatment.',
      icon: 'alert-circle',
    },
    {
      title: 'How to Use',
      content: 'Take clear photos of skin areas you want to check. Ensure good lighting and focus. The app will analyze the image and provide a preliminary assessment.',
      icon: 'camera',
    },
    {
      title: 'Regular Check-ups',
      content: 'Continue with regular professional skin checks. This app is meant to complement, not replace, professional medical care.',
      icon: 'calendar',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#3498db',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: 12,
  },
  skipButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
