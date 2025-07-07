import { supabase } from '../supabaseClient';

// Global auth state
let authState = {
  isAuthenticated: false,
  user: null,
  listeners: new Set()
};

// Demo mode flag
let isDemoMode = false;

// Function to update auth state and notify listeners
const updateAuthState = (isAuthenticated, user = null) => {
  authState.isAuthenticated = isAuthenticated;
  authState.user = user;
  authState.listeners.forEach(listener => listener(isAuthenticated, user));
};

// Function to subscribe to auth state changes
export const subscribeToAuthState = (listener) => {
  // Call the listener immediately with current state
  listener(authState.isAuthenticated, authState.user);

  // Add to listeners for future updates
  authState.listeners.add(listener);
  return () => authState.listeners.delete(listener);
};

// Demo user credentials
const DUMMY_USER = {
  email: 'demo@example.com',
  username: 'demo',
  password: 'demo123',
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Demo User'
};

// Function to generate a proper UUID for demo users
const generateDemoUserId = () => {
  return 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Use consistent demo UUID
};

// Function to ensure a mock user exists in the Supabase 'users' table
export const ensureMockUserExists = async () => {
  try {
    console.log('Mock user initialization skipped for now');
    return { success: true };
  } catch (error) {
    console.error('Error ensuring mock user exists:', error);
    return { success: false, error };
  }
};

// Demo mode functions
export const enableDemoMode = () => {
  isDemoMode = true;
  console.log('Demo mode enabled');
};

export const disableDemoMode = () => {
  isDemoMode = false;
  console.log('Demo mode disabled');
};

export const isInDemoMode = () => {
  return isDemoMode;
};

export const signUp = async (email, password, name) => {
  try {
    console.log('Attempting to sign up user:', email);

    if (isDemoMode) {
      // Demo mode - create mock user with proper UUID
      const mockUser = {
        id: generateDemoUserId(),
        email: email,
        name: name,
        created_at: new Date().toISOString()
      };
      updateAuthState(true, mockUser);
      return { user: mockUser };
    }

    // Real Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          full_name: name
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    console.log('Sign up successful:', data);

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't throw error here as auth was successful
      }
    }

    return { user: data.user };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (emailOrUsername, password) => {
  try {
    console.log('Attempting to sign in user:', emailOrUsername);

    if (isDemoMode) {
      // Demo mode - create mock user with proper UUID
      const mockUser = {
        id: generateDemoUserId(),
        email: emailOrUsername || 'demo@skincheckai.com',
        name: 'Demo User',
        created_at: new Date().toISOString()
      };
      updateAuthState(true, mockUser);
      return { user: mockUser };
    }

    // Real Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrUsername,
      password: password
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful:', data);

    // Update auth state
    updateAuthState(true, data.user);
    return { user: data.user };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('Attempting to sign out');

    if (!isDemoMode) {
      await supabase.auth.signOut();
    }

    // Update auth state
    updateAuthState(false, null);
    console.log('Sign out successful');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  // Return the current user from auth state
  return authState.user;
};
