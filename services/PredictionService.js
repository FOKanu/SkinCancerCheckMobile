import { supabase } from '../supabaseClient';
import { predictSkinLesion } from './ApiService';

const SCANS_TABLE_NAME = 'scans';
const SPOTS_TABLE_NAME = 'spots';
const USERS_TABLE_NAME = 'users';

export async function analyzePrediction(imageUri) {
  // Only get prediction from API
  return await predictSkinLesion(imageUri);
}

export async function createSpot(userId, location = null) {
  if (supabase.__isPlaceholder) {
    return { id: Math.random() };
  }

  try {
    const { data, error } = await supabase
      .from(SPOTS_TABLE_NAME)
      .insert([
        {
          user_id: userId,
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
  // If using placeholder, just resolve
  if (supabase.__isPlaceholder) {
    return [{ id: Math.random(), scanned_at: new Date().toISOString() }];
  }

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

      // If table doesn't exist, just return mock data
      if (error.code === '42P01') {
        console.log('Scans table does not exist, returning mock data');
        return [{ id: Math.random(), scanned_at: new Date().toISOString() }];
      }

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

    // If table doesn't exist, just return mock data
    if (error.code === '42P01') {
      console.log('Scans table does not exist, returning mock data');
      return [{ id: Math.random(), scanned_at: new Date().toISOString() }];
    }

    throw error;
  }
}

export async function getPredictionHistory(userId = null) {
  // If using placeholder, return dummy data
  if (supabase.__isPlaceholder) {
    // Now using 'Low Risk' and 'High Risk' internally
    return [
      {
        id: 1,
        image_url: require('../assets/Skin check ai logo.png'),
        prediction: 'Low Risk',
        confidence: 0.92,
        scanned_at: new Date().toISOString(),
        low_risk_probability: 0.92,
        high_risk_probability: 0.08,
      },
      {
        id: 2,
        image_url: require('../assets/Skin check ai logo.png'),
        prediction: 'High Risk',
        confidence: 0.81,
        scanned_at: new Date(Date.now() - 86400000).toISOString(),
        low_risk_probability: 0.19,
        high_risk_probability: 0.81,
      },
    ];
  }

  try {
    let query = supabase
      .from(SCANS_TABLE_NAME)
      .select(`
        *,
        spots!inner(user_id)
      `);

    if (userId) {
      query = query.eq('spots.user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching prediction history:', error);
      // Return mock data if table doesn't exist
      if (error.code === '42P01') {
        console.log('Scans table does not exist, returning mock data');
        return [
          {
            id: 1,
            image_url: require('../assets/Skin check ai logo.png'),
            prediction: 'Low Risk',
            confidence: 0.92,
            scanned_at: new Date().toISOString(),
            low_risk_probability: 0.92,
            high_risk_probability: 0.08,
          },
          {
            id: 2,
            image_url: require('../assets/Skin check ai logo.png'),
            prediction: 'High Risk',
            confidence: 0.81,
            scanned_at: new Date(Date.now() - 86400000).toISOString(),
            low_risk_probability: 0.19,
            high_risk_probability: 0.81,
          },
        ];
      }
      return [];
    }

    // Transform the data to match the expected format
    return data.map(scan => ({
      id: scan.id,
      prediction: scan.prediction,
      scanned_at: scan.scanned_at,
      // Add mock values for fields not in your schema
      confidence: 0.85,
      low_risk_probability: scan.prediction === 'Low Risk' ? 0.85 : 0.15,
      high_risk_probability: scan.prediction === 'High Risk' ? 0.85 : 0.15,
      image_url: require('../assets/Skin check ai logo.png'),
    }));
  } catch (error) {
    console.error('Error in getPredictionHistory:', error);
    return [];
  }
}
