// Integration test for ML service
const testMLIntegration = async () => {
  console.log('Testing ML service integration...');

  try {
    // Test 1: Health check
    const healthResponse = await fetch('http://localhost:4000/');
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);

    // Test 2: Create a test image
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');

    // Draw a simple test pattern
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(0, 0, 224, 224);
    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.arc(112, 112, 50, 0, 2 * Math.PI);
    ctx.fill();

    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

    // Test 3: Prediction
    const formData = new FormData();
    formData.append('file', blob, 'test.jpg');

    const predictResponse = await fetch('http://localhost:4000/predict', {
      method: 'POST',
      body: formData,
    });

    const predictData = await predictResponse.json();
    console.log('✅ Prediction test passed:', predictData);

    return {
      success: true,
      health: healthData,
      prediction: predictData
    };

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export for use in other files
module.exports = { testMLIntegration };

// Run test if this file is executed directly
if (require.main === module) {
  testMLIntegration().then(result => {
    console.log('Integration test result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
