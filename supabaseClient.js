import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { ensureMockUserExists } from './services/AuthService';

// Initialize the Supabase client
const supabaseUrl = Constants.expoConfig.extra.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig.extra.supabaseAnonKey;

console.log('Initializing Supabase client with:');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  // Don't throw error, create a placeholder client instead
  console.warn('Creating placeholder Supabase client due to missing credentials');
}

let supabase;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');

    // Ensure the mock user exists in the users table
    ensureMockUserExists();
  } else {
    // Create a placeholder client for development
    supabase = {
      __isPlaceholder: true,
      auth: { onAuthStateChange: () => {} },
      from: () => ({ select: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) })
    };
    console.log('Placeholder Supabase client created');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create placeholder instead of throwing
  supabase = {
    __isPlaceholder: true,
    auth: { onAuthStateChange: () => {} },
    from: () => ({ select: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) })
  };
}

// Add error handling and logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session:', session ? 'Active' : 'None');
});

// Test the connection - commented out to prevent errors during initialization
// supabase.from('predictions').select('count').limit(1)
//   .then(({ data, error }) => {
//     if (error) {
//       console.error('Supabase connection test failed:', error);
//     } else {
//       console.log('Supabase connection test successful');
//     }
//   })
//   .catch(error => {
//     console.error('Supabase connection test error:', error);
//   });

export { supabase };
