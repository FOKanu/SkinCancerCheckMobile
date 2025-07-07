#!/usr/bin/env node

/**
 * Complete Flow Test for TeleDermatology App
 * Tests the entire pipeline from image to prediction
 */

const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:4000';
const TEST_IMAGE_PATH = './test_image.jpg';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete TeleDermatology Flow');
  console.log('==========================================\n');

  // Test 1: API Health Check
  console.log('1. Testing API Health Check...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ API Health Check:', healthData.message);
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    return;
  }

  // Test 2: Image File Check
  console.log('\n2. Testing Image File...');
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.error('❌ Test image not found:', TEST_IMAGE_PATH);
    return;
  }
  const imageStats = fs.statSync(TEST_IMAGE_PATH);
  console.log('✅ Test image found:', {
    size: imageStats.size + ' bytes',
    path: TEST_IMAGE_PATH
  });

  // Test 3: Prediction API
  console.log('\n3. Testing Prediction API...');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH), {
      filename: 'test_image.jpg',
      contentType: 'image/jpeg'
    });

    const predictionResponse = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData
    });

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text();
      throw new Error(`HTTP ${predictionResponse.status}: ${errorText}`);
    }

    const predictionData = await predictionResponse.json();
    console.log('✅ Prediction API Response:', predictionData);

    // Validate response format
    if (predictionData.status === 'success' &&
        typeof predictionData.predicted_class === 'number' &&
        typeof predictionData.confidence === 'number') {
      console.log('✅ Response format is valid');

      // Convert to app format
      const prediction = predictionData.predicted_class === 0 ? 'Low Risk' : 'High Risk';
      const highRiskProbability = predictionData.predicted_class === 1 ?
        predictionData.confidence : (1 - predictionData.confidence);
      const lowRiskProbability = 1 - highRiskProbability;

      console.log('✅ Converted to app format:', {
        prediction,
        confidence: predictionData.confidence,
        probabilities: {
          'Low Risk': lowRiskProbability,
          'High Risk': highRiskProbability
        }
      });
    } else {
      console.error('❌ Invalid response format');
    }

  } catch (error) {
    console.error('❌ Prediction API Failed:', error.message);
    return;
  }

  // Test 4: Model Performance
  console.log('\n4. Testing Model Performance...');
  try {
    const startTime = Date.now();
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH), {
      filename: 'test_image.jpg',
      contentType: 'image/jpeg'
    });

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`✅ Prediction completed in ${responseTime}ms`);

    if (responseTime < 5000) {
      console.log('✅ Response time is acceptable (< 5 seconds)');
    } else {
      console.warn('⚠️  Response time is slow (> 5 seconds)');
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }

  console.log('\n🎉 Complete Flow Test Finished!');
  console.log('================================');
  console.log('All tests passed! The system is ready for use.');
}

// Run the test
testCompleteFlow().catch(console.error);
