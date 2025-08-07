import Constants from 'expo-constants';
import { supabase } from '../supabaseClient'; // Import supabase client
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import { Platform } from 'react-native';

const API_BASE_URL = Constants.expoConfig.extra.scoringApiUrl || 'http://localhost:4000';
const BUCKET_NAME = 'lesion-images'; // Your Supabase storage bucket name

// Check if bucket exists and create if needed
const ensureBucketExists = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }

    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      console.log(`Bucket '${BUCKET_NAME}' does not exist, creating...`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log(`Bucket '${BUCKET_NAME}' created successfully`);
    } else {
      console.log(`Bucket '${BUCKET_NAME}' exists`);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};

// Function to upload image to Supabase Storage
const uploadImageToSupabase = async (imageUri) => {
  const fileName = `public/${Date.now()}.jpg`;

  try {
    console.log('Image URI for upload:', imageUri);
    console.log('Platform:', Platform.OS);

    // Ensure bucket exists before upload
    const bucketExists = await ensureBucketExists();
    if (!bucketExists) {
      console.warn('Bucket does not exist, skipping upload');
      return null;
    }

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
  console.log('Image URI:', imageUri); // Debug log
  console.log('Platform:', Platform.OS); // Debug log

  // Validate image URI
  if (!imageUri) {
    throw new Error('No image URI provided');
  }

  // Ensure proper URI format
  if (Platform.OS === 'ios' && !imageUri.startsWith('file://')) {
    throw new Error('Invalid file URI format for iOS');
  }

  const formData = new FormData();

  // Determine the correct MIME type based on file extension
  let formDataType = 'image/jpeg';
  if (imageUri.toLowerCase().endsWith('.png')) {
    formDataType = 'image/png';
  } else if (imageUri.toLowerCase().endsWith('.webp')) {
    formDataType = 'image/webp';
  }

  console.log('Using MIME type:', formDataType); // Debug log
  console.log('Image URI extension:', imageUri.split('.').pop()); // Debug log

  try {
    // For iOS, we need to handle file URIs differently
    if (Platform.OS === 'ios') {
      // Ensure we have a valid file URI
      if (!imageUri.startsWith('file://')) {
        throw new Error('Invalid file URI for iOS');
      }

      // Get file info to ensure it exists
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }

      console.log('iOS file info:', fileInfo);
    }

    // Create form data with proper file handling
    const fileData = {
      uri: imageUri,
      type: formDataType,
      name: 'image.jpg'
    };

    console.log('File data object:', fileData); // Debug log
    formData.append('file', fileData);

    console.log('FormData created successfully'); // Debug log

    // Make the API request
    const requestUrl = `${API_BASE_URL}/predict`;
    console.log('Making request to:', requestUrl); // Debug log

    const response = await fetch(requestUrl, {
      method: 'POST',
      body: formData,
      // Let the browser set the Content-Type automatically for FormData
    });

    console.log('API response status:', response.status); // Debug log
    console.log('API response headers:', response.headers); // Debug log

    console.log('API response status:', response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);

          if (response.status === 422) {
      console.log('422 error detected - checking image format...'); // Debug log

      // Log more details about the image
      try {
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        console.log('File info for debugging:', fileInfo);

        // Try to read first few bytes to check format
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        console.log('Image base64 length:', base64.length);
        console.log('First 100 chars of base64:', base64.substring(0, 100));
      } catch (debugError) {
        console.error('Error reading image for debugging:', debugError);
      }

      throw new Error(`Image format error (422): Please ensure the image is in JPEG, PNG, or WebP format and is not corrupted.`);
    }

    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API response result:', result); // Debug log

    // Upload to Supabase for storage
    try {
      const supabaseUrl = await uploadImageToSupabase(imageUri);
      if (supabaseUrl) {
        console.log('Image uploaded to Supabase:', supabaseUrl);
      } else {
        console.log('Image upload skipped (bucket not available)');
      }
    } catch (uploadError) {
      console.warn('Failed to upload to Supabase:', uploadError);
      // Don't throw here, as the main prediction was successful
    }

    return result;
  } catch (error) {
    console.error('Error in predictSkinLesion:', error);
    throw error;
  }
}

export function getDisplayLabel(prediction) {
  if (prediction === 0) {
    return 'Low Risk';
  } else if (prediction === 1) {
    return 'High Risk';
  } else {
    return 'Unknown';
  }
}
