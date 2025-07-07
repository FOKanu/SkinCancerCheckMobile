import { supabase } from '../supabaseClient';
import { predictSkinLesion } from './ApiService';
import { getCurrentUser } from './AuthService';

const SCANS_TABLE_NAME = 'scans';
const SPOTS_TABLE_NAME = 'spots';
const USERS_TABLE_NAME = 'users';

export async function analyzePrediction(imageUri) {
  // Only get prediction from API
  return await predictSkinLesion(imageUri);
}

export async function createSpot(userId = null, location = null) {
  try {
    // Get current user if userId not provided
    const currentUser = getCurrentUser();
    const actualUserId = userId || currentUser?.id;

    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(SPOTS_TABLE_NAME)
      .insert([
        {
          user_id: actualUserId,
          location: location,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error in createSpot:', {
        error,
        message: error.message,
        details: error.details,
        code: error.code
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createSpot:', {
      error,
      message: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }
}

export async function savePredictionToSupabase(result, imageUri, spotId) {
  try {
    const { data, error } = await supabase
      .from(SCANS_TABLE_NAME)
      .insert([
        {
          spot_id: spotId.id,
          prediction: result.prediction,
          scanned_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error saving prediction to Supabase:', {
        error,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in savePredictionToSupabase:', {
      error,
      message: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }
}

// Function to get demo images from Supabase bucket
async function getDemoImages() {
  try {
    // List files in the lesion-images bucket
    const { data: files, error } = await supabase.storage
      .from('lesion-images')
      .list('public', {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error('Error listing demo images:', error);
      return [];
    }

    // Get public URLs for the images
    const imageUrls = files
      .filter(file => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
      .map(file => {
        const { data } = supabase.storage
          .from('lesion-images')
          .getPublicUrl(`public/${file.name}`);
        return data.publicUrl;
      });

    console.log('Found demo images:', imageUrls.length);
    return imageUrls;
  } catch (error) {
    console.error('Error getting demo images:', error);
    return [];
  }
}

export async function getPredictionHistory(userId = null) {
  try {
    // Get current user if userId not provided
    const currentUser = getCurrentUser();
    const actualUserId = userId || currentUser?.id;

    if (!actualUserId) {
      console.log('No user authenticated, returning empty array');
      return [];
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(actualUserId)) {
      console.warn('Invalid UUID format for user ID:', actualUserId);
      return [];
    }

    console.log('Fetching prediction history for user:', actualUserId);

    let query = supabase
      .from(SCANS_TABLE_NAME)
      .select(`
        *,
        spots!inner(user_id)
      `);

    // Filter by user_id to ensure data isolation
    query = query.eq('spots.user_id', actualUserId);

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }

    console.log('Successfully fetched prediction history:', data?.length || 0, 'records');

    // Get demo images for demo users
    let demoImages = [];
    if (currentUser?.email === 'demo@skincheckai.com') {
      demoImages = await getDemoImages();
    }

    // Transform the data to match the expected format
    return data.map((scan, index) => {
      // For demo users, use real images from bucket, otherwise use placeholder
      let imageUrl;
      if (currentUser?.email === 'demo@skincheckai.com' && demoImages.length > 0) {
        // Cycle through demo images
        imageUrl = demoImages[index % demoImages.length];
      } else {
        // Use placeholder for non-demo users or if no demo images available
        imageUrl = require('../assets/Skin check ai logo.png');
      }

      return {
        id: scan.id,
        prediction: scan.prediction,
        scanned_at: scan.scanned_at,
        // Add mock values for fields not in your schema
        confidence: 0.85,
        low_risk_probability: scan.prediction === 'Low Risk' ? 0.85 : 0.15,
        high_risk_probability: scan.prediction === 'High Risk' ? 0.85 : 0.15,
        image_url: imageUrl,
      };
    });
  } catch (error) {
    console.error('Error in getPredictionHistory:', error);
    return [];
  }
}
