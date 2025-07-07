import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize the Supabase client with your credentials
const supabaseUrl = 'https://fpkbrdyzkarkfsluxksg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa2JyZHl6a2Fya2ZzbHV4a3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMTkzMzcsImV4cCI6MjA2NDY5NTMzN30.FdRFstLqsuwJAXHtIc3QDHTsnMkRfAD2_1uxc8Wx5Og';

console.log('Initializing Supabase client with:');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  throw new Error('Supabase credentials are required');
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
