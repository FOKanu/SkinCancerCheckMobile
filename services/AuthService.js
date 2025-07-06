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
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Demo User'
};

// Function to ensure a mock user exists in the Supabase 'users' table
export const ensureMockUserExists = async () => {
  // Simplified version to prevent initialization errors
  console.log('Mock user initialization skipped for now');
  return;
};

export const signIn = async (emailOrUsername, password) => {
  try {
    // For testing, accept any credentials
    const mockUser = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: emailOrUsername || 'test@example.com',
      name: 'Test User'
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

export const getCurrentUser = () => {
  // Return the current user from auth state
  return authState.user;
};
