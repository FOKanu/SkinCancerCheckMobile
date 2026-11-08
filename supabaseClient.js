import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase credentials are provided via app.config.js `extra`
// (SUPABASE_URL / SUPABASE_ANON_KEY environment variables — see .env.example).
// The anon key is a publishable client key; data access is enforced by
// Row Level Security policies in Supabase, not by hiding this key.
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('your-supabase-url') ||
  supabaseAnonKey === 'your-supabase-anon-key'
) {
  console.error('Missing Supabase credentials');
  throw new Error(
    'Supabase credentials are required. Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file (see .env.example).'
  );
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw error;
}

// Add error handling and logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session:', session ? 'Active' : 'None');
});

export { supabase };
