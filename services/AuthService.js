import { supabase } from '../supabaseClient';

// Global auth state
let authState = {
  isAuthenticated: false,
  user: null,
  listeners: new Set()
};

// Function to update auth state and notify listeners
const updateAuthState = (isAuthenticated, user = null) => {
  authState.isAuthenticated = isAuthenticated;
  authState.user = user;
  authState.listeners.forEach(listener => listener(isAuthenticated, user));
};

// Function to subscribe to auth state changes
export const subscribeToAuthState = (listener) => {
  authState.listeners.add(listener);
  return () => authState.listeners.delete(listener);
};

// Demo user credentials
const DUMMY_USER = {
  email: 'demo@example.com',
  username: 'demo',
  password: 'demo123',
  id: 'demo-user-id',
  full_name: 'Demo User'
};

export const signIn = async (emailOrUsername, password) => {
  try {
    // For testing, accept any credentials
    const mockUser = {
      id: 'test-user-id',
      email: emailOrUsername || 'test@example.com',
      full_name: 'Test User'
    };

    // Update auth state
    updateAuthState(true, mockUser);

    return { user: mockUser };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Update auth state
    updateAuthState(false, null);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Return the current user from auth state
    return authState.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
