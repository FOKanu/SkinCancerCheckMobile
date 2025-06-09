import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const educationTopics = [
  {
    id: 1,
    title: 'Understanding Skin Cancer',
    description: 'Learn about different types of skin cancer and their characteristics.',
    icon: 'information-circle',
    color: '#3498db',
  },
  {
    id: 2,
    title: 'ABCDE Rule',
    description: 'Master the ABCDE rule for identifying potential skin cancer signs.',
    icon: 'alert-circle',
    color: '#e74c3c',
  },
  {
    id: 3,
    title: 'Prevention Tips',
    description: 'Essential tips for preventing skin cancer and protecting your skin.',
    icon: 'shield-checkmark',
    color: '#2ecc71',
  },
  {
    id: 4,
    title: 'Self-Examination',
    description: 'Learn how to perform regular self-examinations effectively.',
    icon: 'body',
    color: '#f1c40f',
  },
];

const aiTips = [
  {
    id: 1,
    title: 'Daily Sun Protection',
    description: 'Based on your location and UV index, apply SPF 50+ sunscreen every 2 hours when outdoors.',
    icon: 'sunny',
    color: '#f1c40f',
  },
  {
    id: 2,
    title: 'Hydration Reminder',
    description: 'Your skin shows signs of dehydration. Increase water intake and use a hyaluronic acid serum.',
    icon: 'water',
    color: '#3498db',
  },
  {
    id: 3,
    title: 'Skin Barrier Support',
    description: 'Your skin barrier needs strengthening. Consider incorporating ceramides in your routine.',
    icon: 'shield',
    color: '#2ecc71',
  },
];

const topProducts = [
  {
    id: 1,
    name: 'La Roche-Posay Anthelios',
    description: 'SPF 50+ Mineral Sunscreen',
    rating: 4.8,
    image: 'https://via.placeholder.com/100',
    category: 'Sunscreen',
  },
  {
    id: 2,
    name: 'CeraVe Moisturizing Cream',
    description: 'With Ceramides & Hyaluronic Acid',
    rating: 4.7,
    image: 'https://via.placeholder.com/100',
    category: 'Moisturizer',
  },
  {
    id: 3,
    name: 'Neutrogena Hydro Boost',
    description: 'Water Gel Moisturizer',
    rating: 4.6,
    image: 'https://via.placeholder.com/100',
    category: 'Hydration',
  },
];

const resources = [
  {
    id: 1,
    title: 'Skin Cancer Foundation',
    description: 'Visit the official website for comprehensive information.',
    url: 'https://www.skincancer.org',
    icon: 'globe',
  },
  {
    id: 2,
    title: 'American Cancer Society',
    description: 'Access reliable resources and support.',
    url: 'https://www.cancer.org',
    icon: 'medkit',
  },
];

export default function EducationScreen() {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Learn & Resources</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  );

  const renderTopicCard = (topic) => (
    <TouchableOpacity key={topic.id} style={styles.topicCard}>
      <View style={[styles.iconContainer, { backgroundColor: topic.color + '20' }]}>
        <Ionicons name={topic.icon} size={24} color={topic.color} />
      </View>
      <View style={styles.topicContent}>
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <Text style={styles.topicDescription}>{topic.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
    </TouchableOpacity>
  );

  const renderAITipCard = (tip) => (
    <View key={tip.id} style={styles.aiTipCard}>
      <View style={[styles.iconContainer, { backgroundColor: tip.color + '20' }]}>
        <Ionicons name={tip.icon} size={24} color={tip.color} />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipDescription}>{tip.description}</Text>
      </View>
    </View>
  );

  const renderProductCard = (product) => (
    <TouchableOpacity key={product.id} style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#f1c40f" />
            <Text style={styles.rating}>{product.rating}</Text>
          </View>
        </View>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderResourceCard = (resource) => (
    <TouchableOpacity key={resource.id} style={styles.resourceCard}>
      <View style={styles.resourceIcon}>
        <Ionicons name={resource.icon} size={24} color="#3498db" />
      </View>
      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle}>{resource.title}</Text>
        <Text style={styles.resourceDescription}>{resource.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/400x200' }}
            style={styles.heroImage}
          />
          <Text style={styles.heroTitle}>Skin Cancer Education</Text>
          <Text style={styles.heroDescription}>
            Learn about skin cancer prevention, detection, and treatment through our comprehensive educational resources.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Topics</Text>
          {educationTopics.map(renderTopicCard)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI-Powered Skin Care Tips</Text>
            <TouchableOpacity>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {aiTips.map(renderAITipCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Skin Care Products</Text>
          {topProducts.map(renderProductCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>External Resources</Text>
          {resources.map(renderResourceCard)}
        </View>

        <View style={styles.emergencySection}>
          <Ionicons name="warning" size={32} color="#e74c3c" />
          <Text style={styles.emergencyTitle}>Emergency Warning</Text>
          <Text style={styles.emergencyText}>
            If you notice any sudden changes in your skin or have concerns about a lesion, please consult a healthcare professional immediately.
          </Text>
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
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  refreshText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  topicCard: {
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
  aiTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  tipContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  tipDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productContent: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emergencySection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  },
});
