import { supabase } from '../supabaseClient';
import { predictSkinLesion } from './ApiService';
import { getCurrentUser } from './AuthService';

const SCANS_TABLE_NAME = 'scans';
const SPOTS_TABLE_NAME = 'spots';
const USERS_TABLE_NAME = 'users';

export async function analyzePrediction(imageUri) {
  // Get prediction from API and transform to expected format
  const apiResult = await predictSkinLesion(imageUri);

  // Transform API response to match app expectations
  return {
    prediction: apiResult.predicted_class,
    confidence: apiResult.confidence,
    status: apiResult.status
  };
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

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });

    let query = supabase
      .from(SCANS_TABLE_NAME)
      .select(`
        *,
        spots!inner(user_id)
      `);

    // Filter by user_id to ensure data isolation
    query = query.eq('spots.user_id', actualUserId);

    // Race between the query and timeout
    let data, error;
    try {
      const result = await Promise.race([
        query,
        timeoutPromise
      ]);
      data = result.data;
      error = result.error;
    } catch (raceError) {
      console.error('Error in Promise.race:', raceError);
      error = raceError;
    }

    if (error) {
      console.error('Error fetching prediction history:', error);

      // Return mock data for demo users when there's an error
      if (currentUser?.email === 'demo@skincheckai.com') {
        console.log('Returning mock data for demo user due to error');
        return getMockPredictionHistory();
      }

      return [];
    }

    console.log('Successfully fetched prediction history:', data?.length || 0, 'records');

    // Handle null or empty data
    if (!data || data.length === 0) {
      console.log('No prediction history data found');
      return [];
    }

    // Get demo images for demo users
    let demoImages = [];
    if (currentUser?.email === 'demo@skincheckai.com') {
      try {
        demoImages = await getDemoImages();
        console.log('Demo images loaded:', demoImages.length);
      } catch (imageError) {
        console.error('Error getting demo images:', imageError);
        // Continue without demo images
      }
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

    // Return mock data for demo users when there's an error
    const currentUser = getCurrentUser();
    if (currentUser?.email === 'demo@skincheckai.com') {
      console.log('Returning mock data for demo user due to error');
      return getMockPredictionHistory();
    }

    return [];
  }
}

// Mock prediction history for demo users when database is unavailable
function getMockPredictionHistory() {
  return [
    {
      id: 'mock-1',
      prediction: 'Low Risk',
      confidence: 0.92,
      low_risk_probability: 0.92,
      high_risk_probability: 0.08,
      scanned_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      image_url: require('../assets/Skin check ai logo.png'),
    },
    {
      id: 'mock-2',
      prediction: 'High Risk',
      confidence: 0.81,
      low_risk_probability: 0.19,
      high_risk_probability: 0.81,
      scanned_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      image_url: require('../assets/Skin check ai logo.png'),
    },
    {
      id: 'mock-3',
      prediction: 'Low Risk',
      confidence: 0.88,
      low_risk_probability: 0.88,
      high_risk_probability: 0.12,
      scanned_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      image_url: require('../assets/Skin check ai logo.png'),
    },
  ];
}
