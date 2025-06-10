import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig.extra.scoringApiUrl || 'http://localhost:4000';

export async function predictSkinLesion(imageUri) {
  console.log('Using API URL:', API_BASE_URL); // Debug log
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const apiResponse = await response.json();
    if (apiResponse.status === 'error') {
      throw new Error(apiResponse.error || 'Prediction failed');
    }
    const prediction = apiResponse.predicted_class === 0 ? 'benign' : 'malignant';
    const malignantProbability = apiResponse.predicted_class === 1 ? apiResponse.confidence : (1 - apiResponse.confidence);
    const benignProbability = 1 - malignantProbability;
    return {
      prediction,
      confidence: apiResponse.confidence,
      probabilities: {
        benign: benignProbability,
        malignant: malignantProbability,
      },
    };
  } catch (error) {
    console.error('Error predicting skin lesion:', error);
    throw error;
  }
}
