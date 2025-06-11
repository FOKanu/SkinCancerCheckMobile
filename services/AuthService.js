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
  const mockUserId = DUMMY_USER.id;
  const mockUserEmail = DUMMY_USER.email;

  console.log('Attempting to ensure mock user exists:', { id: mockUserId, email: mockUserEmail });

  try {
    // Check if user already exists in auth.users
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', mockUserId)
      .limit(1);

    if (selectError) {
      console.error('Error checking for existing mock user:', selectError);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Mock user already exists in Supabase users table.');
      return;
    }

    // If user does not exist, insert them
    console.log('Inserting mock user into Supabase users table...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: mockUserId,
          email: mockUserEmail,
          created_at: new Date().toISOString(),
          name: DUMMY_USER.name,
        },
      ])
      .select(); // Ensure the inserted data is returned

    if (insertError) {
      if (insertError.code === '23505') {
        console.log('Mock user already exists (unique constraint violation).');
      } else {
        console.error('Error inserting mock user into Supabase users table:', insertError);
      }
      return;
    }

    console.log('Mock user inserted into Supabase users table successfully:', newUser);
  } catch (error) {
    console.error('Unexpected error in ensureMockUserExists:', error);
  }
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
