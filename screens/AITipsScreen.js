import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPredictionHistory } from '../services/PredictionService';
import { getCurrentUser } from '../services/AuthService';

export default function AITipsScreen({ navigation }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        const history = await getPredictionHistory(currentUser?.id);
        const processedTips = generateTips(history);
        setTips(processedTips);
      } catch (error) {
        console.error('Error fetching tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const generateTips = (history) => {
    const tips = [];
    const highRiskSpots = history.filter(item => item.prediction === 'malignant');

    // Add general tips
    tips.push({
      id: 'general-1',
      category: 'general',
      title: 'Daily Sun Protection',
      description: 'Apply broad-spectrum SPF 50+ sunscreen every 2 hours when outdoors. Wear protective clothing and seek shade during peak UV hours (10 AM - 4 PM).',
      icon: 'sunny',
      color: '#f1c40f',
      priority: 'high',
    });

    tips.push({
      id: 'general-2',
      category: 'general',
      title: 'Skin Hydration',
      description: 'Keep your skin well-hydrated by drinking plenty of water and using a gentle, fragrance-free moisturizer twice daily.',
      icon: 'water',
      color: '#3498db',
      priority: 'medium',
    });

    // Add tips based on high-risk predictions
    if (highRiskSpots.length > 0) {
      tips.push({
        id: 'high-risk-1',
        category: 'high-risk',
        title: 'Professional Consultation Required',
        description: 'Based on your scan history, we recommend scheduling a consultation with a dermatologist for a thorough examination of your skin.',
        icon: 'medkit',
        color: '#e74c3c',
        priority: 'high',
        action: 'Schedule Consultation',
      });

      tips.push({
        id: 'high-risk-2',
        category: 'high-risk',
        title: 'Regular Monitoring',
        description: 'Take clear, well-lit photos of concerning areas every two weeks to track any changes. Note any changes in size, color, or texture.',
        icon: 'camera',
        color: '#e74c3c',
        priority: 'high',
      });
    }

    // Add skincare routine tips
    tips.push({
      id: 'routine-1',
      category: 'routine',
      title: 'Gentle Cleansing',
      description: 'Use a mild, non-abrasive cleanser twice daily. Avoid harsh scrubs or exfoliants that could irritate sensitive areas.',
      icon: 'water',
      color: '#2ecc71',
      priority: 'medium',
    });

    tips.push({
      id: 'routine-2',
      category: 'routine',
      title: 'Skin Barrier Support',
      description: 'Consider incorporating products with ceramides, hyaluronic acid, and niacinamide to strengthen your skin barrier.',
      icon: 'shield',
      color: '#2ecc71',
      priority: 'medium',
    });

    // Add product recommendations
    tips.push({
      id: 'product-1',
      category: 'products',
      title: 'Recommended Sunscreen',
      description: 'La Roche-Posay Anthelios SPF 50+ Mineral Sunscreen - Provides broad-spectrum protection without irritating sensitive skin.',
      icon: 'sunny',
      color: '#f1c40f',
      priority: 'high',
      product: {
        name: 'La Roche-Posay Anthelios',
        type: 'Sunscreen',
        rating: 4.8,
      },
    });

    tips.push({
      id: 'product-2',
      category: 'products',
      title: 'Gentle Moisturizer',
      description: 'CeraVe Moisturizing Cream - Contains ceramides and hyaluronic acid to maintain skin barrier health.',
      icon: 'water',
      color: '#3498db',
      priority: 'medium',
      product: {
        name: 'CeraVe Moisturizing Cream',
        type: 'Moisturizer',
        rating: 4.7,
      },
    });

    return tips.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>AI-Powered Tips</Text>
      <TouchableOpacity style={styles.refreshButton}>
        <Ionicons name="refresh" size={24} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  );

  const renderTipCard = (tip) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
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

    return (
      <View key={tip.id} style={styles.tipCard}>
        <View style={[styles.iconContainer, { backgroundColor: tip.color + '20' }]}>
          <Ionicons name={tip.icon} size={24} color={tip.color} />
        </View>
        <View style={styles.tipContent}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(tip.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(tip.priority) }]}>
                {tip.priority.charAt(0).toUpperCase() + tip.priority.slice(1)} Priority
              </Text>
            </View>
          </View>
          <Text style={styles.tipDescription}>{tip.description}</Text>
          {tip.product && (
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{tip.product.name}</Text>
              <View style={styles.productDetails}>
                <Text style={styles.productType}>{tip.product.type}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#f1c40f" />
                  <Text style={styles.rating}>{tip.product.rating}</Text>
                </View>
              </View>
            </View>
          )}
          {tip.action && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{tip.action}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={24} color="#e74c3c" />
          <Text style={styles.warningText}>
            These tips are AI-generated recommendations and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          {tips.map(renderTipCard)}
        </View>

        <View style={styles.emergencySection}>
          <Ionicons name="medkit" size={32} color="#e74c3c" />
          <Text style={styles.emergencyTitle}>Professional Consultation</Text>
          <Text style={styles.emergencyText}>
            If you have any high-risk predictions or notice changes in your skin, please schedule a consultation with a dermatologist immediately. Early detection and professional medical care are crucial for successful treatment.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Find a Dermatologist</Text>
          </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refreshButton: {
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
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    color: '#e74c3c',
    fontSize: 14,
    lineHeight: 20,
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
  tipCard: {
    flexDirection: 'row',
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
  tipContent: {
    flex: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  productInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productType: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emergencySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 12,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
