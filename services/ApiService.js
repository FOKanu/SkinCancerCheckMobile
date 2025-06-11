import Constants from 'expo-constants';
import { supabase } from '../supabaseClient'; // Import supabase client
import * as FileSystem from 'expo-file-system'; // Import FileSystem

const API_BASE_URL = Constants.expoConfig.extra.scoringApiUrl || 'http://localhost:4000';
const BUCKET_NAME = 'lesion-images'; // Your Supabase storage bucket name

// Function to upload image to Supabase Storage
const uploadImageToSupabase = async (imageUri) => {
  const fileName = `public/${Date.now()}.jpg`;

  try {
    console.log('Image URI for upload:', imageUri);

    // Get file info and ensure it exists and is not empty
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    console.log('File info before reading:', fileInfo);
    if (!fileInfo.exists) {
      throw new Error('Local image file does not exist at URI.');
    }
    if (fileInfo.size === 0) {
      throw new Error('Local image file is empty.');
    }

    // Read the file content as a Base64 string
    let base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

    // Determine content type (default to jpeg)
    let contentType = 'image/jpeg';
    if (imageUri.toLowerCase().endsWith('.png')) {
      contentType = 'image/png';
    } else if (imageUri.toLowerCase().endsWith('.webp')) {
      contentType = 'image/webp';
    }
    console.log('Inferred content type from URI extension:', contentType);

    // IMPORTANT: Remove any potential data URI prefix (e.g., 'data:image/jpeg;base64,')
    // And try to extract content type from prefix if present.
    if (base64.startsWith('data:')) {
      const parts = base64.split(',');
      if (parts.length > 1) {
        // Extract content type from the data URI prefix if it's there
        const extractedType = parts[0].substring(parts[0].indexOf(':') + 1, parts[0].lastIndexOf(';'));
        if (extractedType) {
          contentType = extractedType;
          console.log('Content type extracted from data URI prefix:', contentType);
        }
        base64 = parts[1]; // Get the actual base64 data
      }
    }
    console.log('Final content type for upload:', contentType);
    console.log('Base64 string length (after processing):', base64.length);
    console.log('First 50 chars of Base64:', base64.substring(0, 50));
    console.log('Last 50 chars of Base64:', base64.substring(base64.length - 50));

    // Upload the Base64 string directly to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, base64, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType, // Use dynamically determined content type
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    if (publicUrlData && publicUrlData.publicUrl) {
      console.log('Image uploaded to Supabase Storage:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } else {
      throw new Error('Failed to get public URL after upload.');
    }
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
};

export async function predictSkinLesion(imageUri) {
  console.log('Using API URL:', API_BASE_URL); // Debug log

  let imageUrlForAPI = imageUri; // Default to original URI

  try {
    // Upload image to Supabase Storage first
    const publicImageUrl = await uploadImageToSupabase(imageUri);
    imageUrlForAPI = publicImageUrl; // Use public URL for API if needed
  } catch (uploadError) {
    console.error('Failed to upload image to Supabase Storage, proceeding with original URI for API:', uploadError);
    // Continue with original URI if upload fails
  }

  const formData = new FormData();
  // For the scoring API, we'll still send the local URI as a file.
  // The type of the file in formData.append should ideally match the actual image type.
  // We can try to infer it from the imageUri or the Base64 prefix if needed, but for now,
  // we'll keep it as image/jpeg as most ML models expect JPEG.
  let formDataType = 'image/jpeg';
  if (imageUri.toLowerCase().endsWith('.png')) {
    formDataType = 'image/png';
  } else if (imageUri.toLowerCase().endsWith('.webp')) {
    formDataType = 'image/webp';
  }

  formData.append('file', {
    uri: imageUri,
    name: 'photo.jpg',
    type: formDataType, // Use dynamically determined type
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
      uploadedImageUrl: imageUrlForAPI, // Return the public URL for saving to database
    };
  } catch (error) {
    console.error('Error predicting skin lesion:', error);
    throw error;
  }
}
