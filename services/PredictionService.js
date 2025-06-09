import { supabase } from '../supabaseClient';
import { predictSkinLesion } from './ApiService';

const TABLE_NAME = 'predictions';

export async function analyzePrediction(imageUri) {
  // Only get prediction from API
  return await predictSkinLesion(imageUri);
}

export async function savePredictionToSupabase(result, imageUri, userId = null) {
  // If using placeholder, just resolve
  if (supabase.__isPlaceholder) {
    return [{ id: Math.random(), created_at: new Date().toISOString() }];
  }
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        user_id: userId,
        image_url: imageUri,
        prediction: result.prediction,
        confidence: result.confidence,
        benign_probability: result.probabilities.benign,
        malignant_probability: result.probabilities.malignant,
        created_at: new Date().toISOString(),
      },
    ]);
  if (error) {
    console.error('Error saving prediction to Supabase:', error);
  }
  return data;
}

export async function getPredictionHistory(userId = null) {
  // If using placeholder, return dummy data
  if (supabase.__isPlaceholder) {
    return [
      {
        id: 1,
        image_url: 'https://via.placeholder.com/120',
        prediction: 'benign',
        confidence: 0.92,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        image_url: 'https://via.placeholder.com/120',
        prediction: 'malignant',
        confidence: 0.81,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching prediction history:', error);
    return [];
  }
  return data;
}
