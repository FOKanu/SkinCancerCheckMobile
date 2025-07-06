import { supabase } from '../supabaseClient.js';

// Create predictions table using direct SQL
export async function createPredictionsTable() {
  const { error } = await supabase
    .from('predictions')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, create it
    console.log('Creating predictions table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS predictions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          image_url TEXT NOT NULL,
          prediction TEXT NOT NULL,
          confidence FLOAT NOT NULL,
          low_risk_probability FLOAT NOT NULL,
          high_risk_probability FLOAT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (createError) {
      console.error('Error creating predictions table:', createError);
      return false;
    }
  }
  return true;
}

// Create users table using direct SQL
export async function createUsersTable() {
  const { error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, create it
    console.log('Creating users table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          last_login TIMESTAMP WITH TIME ZONE
        );
      `
    });

    if (createError) {
      console.error('Error creating users table:', createError);
      return false;
    }
  }
  return true;
}

// Create skin_care_tips table using direct SQL
export async function createSkinCareTipsTable() {
  const { error } = await supabase
    .from('skin_care_tips')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, create it
    console.log('Creating skin_care_tips table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS skin_care_tips (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (createError) {
      console.error('Error creating skin_care_tips table:', createError);
      return false;
    }
  }
  return true;
}

// Create products table using direct SQL
export async function createProductsTable() {
  const { error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, create it
    console.log('Creating products table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          rating FLOAT NOT NULL,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (createError) {
      console.error('Error creating products table:', createError);
      return false;
    }
  }
  return true;
}

// Insert sample data into skin_care_tips
export async function insertSampleSkinCareTips() {
  const tips = [
    {
      title: 'Daily Sun Protection',
      description: 'Apply SPF 50+ sunscreen every 2 hours when outdoors.',
      category: 'Protection'
    },
    {
      title: 'Hydration Reminder',
      description: 'Keep your skin hydrated by drinking plenty of water and using moisturizers.',
      category: 'Hydration'
    },
    {
      title: 'Skin Barrier Support',
      description: 'Use products with ceramides to strengthen your skin barrier.',
      category: 'Care'
    }
  ];

  const { error } = await supabase
    .from('skin_care_tips')
    .insert(tips);

  if (error) {
    console.error('Error inserting sample skin care tips:', error);
    return false;
  }
  return true;
}

// Insert sample data into products
export async function insertSampleProducts() {
  const products = [
    {
      name: 'La Roche-Posay Anthelios',
      description: 'SPF 50+ Mineral Sunscreen',
      category: 'Sunscreen',
      rating: 4.8,
      image_url: 'https://via.placeholder.com/100'
    },
    {
      name: 'CeraVe Moisturizing Cream',
      description: 'With Ceramides & Hyaluronic Acid',
      category: 'Moisturizer',
      rating: 4.7,
      image_url: 'https://via.placeholder.com/100'
    },
    {
      name: 'Neutrogena Hydro Boost',
      description: 'Water Gel Moisturizer',
      category: 'Hydration',
      rating: 4.6,
      image_url: 'https://via.placeholder.com/100'
    }
  ];

  const { error } = await supabase
    .from('products')
    .insert(products);

  if (error) {
    console.error('Error inserting sample products:', error);
    return false;
  }
  return true;
}

// Initialize all tables and sample data
export async function initializeDatabase() {
  try {
    // Create tables
    await createPredictionsTable();
    await createUsersTable();
    await createSkinCareTipsTable();
    await createProductsTable();

    // Insert sample data
    await insertSampleSkinCareTips();
    await insertSampleProducts();

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
