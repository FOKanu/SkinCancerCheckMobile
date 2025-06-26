import { supabase } from '../supabaseClient';
import { predictSkinLesion } from './ApiService';

const SCANS_TABLE_NAME = 'scans';
const SPOTS_TABLE_NAME = 'spots';

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
          created_at: new Date().toISOString(),
        },
      ])
      .select(); // Ensure the inserted data is returned

    if (error) {
      console.error('Error creating spot:', {
        error,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    return data[0]; // Return the first (and only) inserted record
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
          spot_id: spotId,
          image_url: result.uploadedImageUrl,
          prediction: result.prediction,
          confidence: result.confidence,
          low_risk_probability: result.probabilities['Low Risk'],
          high_risk_probability: result.probabilities['High Risk'],
          scanned_at: new Date().toISOString(),
        },
      ]);

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

export async function getPredictionHistory(userId = null) {
  // If using placeholder, return dummy data
  if (supabase.__isPlaceholder) {
    // Now using 'Low Risk' and 'High Risk' internally
    return [
      {
        id: 1,
        image_url: 'https://via.placeholder.com/120',
        prediction: 'Low Risk',
        confidence: 0.92,
        scanned_at: new Date().toISOString(),
        low_risk_probability: 0.92,
        high_risk_probability: 0.08,
      },
      {
        id: 2,
        image_url: 'https://via.placeholder.com/120',
        prediction: 'High Risk',
        confidence: 0.81,
        scanned_at: new Date(Date.now() - 86400000).toISOString(),
        low_risk_probability: 0.19,
        high_risk_probability: 0.81,
      },
    ];
  }
  let query = supabase
    .from(SCANS_TABLE_NAME)
    .select(`*,\
      spot:spot_id (
        user_id
      )`);
  if (userId) {
    query = query.eq('spot.user_id', userId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching prediction history:', error);
    return [];
  }
  return data;
}
