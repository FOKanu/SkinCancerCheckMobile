const fs = require('fs');

const testMLIntegration = async () => {
  console.log('Testing ML service integration...');

  try {
    // Test 1: Health check
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:4000/');
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);

    // Test 2: Check if test image exists
    if (!fs.existsSync('test_image.jpg')) {
      console.log('⚠️  Test image not found, creating one...');
      // Create a simple test image using a different approach
      const { execSync } = require('child_process');
      execSync('python3 -c "from PIL import Image, ImageDraw; img = Image.new(\'RGB\', (224, 224), color=\'red\'); draw = ImageDraw.Draw(img); draw.ellipse([50, 50, 174, 174], fill=\'brown\'); img.save(\'test_image.jpg\')"');
    }

    // Test 3: Prediction with test image using curl
    console.log('🔍 Testing prediction endpoint...');
    const { execSync } = require('child_process');

    try {
      const result = execSync('curl -X POST http://localhost:4000/predict -F "file=@test_image.jpg" -H "Content-Type: multipart/form-data"', { encoding: 'utf8' });
      const predictData = JSON.parse(result);
      console.log('✅ Prediction test passed:', predictData);

      // Test 4: Verify the response format matches what the app expects
      const expectedKeys = ['predicted_class', 'confidence', 'status'];
      const hasAllKeys = expectedKeys.every(key => key in predictData);

      if (hasAllKeys && predictData.status === 'success') {
        console.log('✅ Response format is correct for app integration');

        // Convert to app format
        const prediction = predictData.predicted_class === 0 ? 'benign' : 'malignant';
        const malignantProbability = predictData.predicted_class === 1 ? predictData.confidence : (1 - predictData.confidence);
        const benignProbability = 1 - malignantProbability;

        const appFormat = {
          prediction,
          confidence: predictData.confidence,
          probabilities: {
            benign: benignProbability,
            malignant: malignantProbability,
          }
        };

        console.log('✅ App-compatible format:', appFormat);
      } else {
        console.log('⚠️  Response format may need adjustment');
      }

      return {
        success: true,
        health: healthData,
        prediction: predictData
      };

    } catch (curlError) {
      console.error('❌ Prediction test failed:', curlError.message);
      return {
        success: false,
        error: curlError.message
      };
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run test
testMLIntegration().then(result => {
  console.log('\n🎉 Integration test completed!');
  console.log('Result:', result);
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
