import { supabase } from '../supabaseClient';

// Create predictions table
export async function createPredictionsTable() {
  const { error } = await supabase.rpc('create_predictions_table', {
    table_name: 'predictions',
    columns: `
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users(id),
      image_url text not null,
      prediction text not null,
      confidence float not null,
      low_risk_probability float not null,
      high_risk_probability float not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    `
  });

  if (error) {
    console.error('Error creating predictions table:', error);
    return false;
  }
  return true;
}

// Create users table
export async function createUsersTable() {
  const { error } = await supabase.rpc('create_users_table', {
    table_name: 'users',
    columns: `
      id uuid references auth.users(id) primary key,
      email text unique not null,
      full_name text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      last_login timestamp with time zone
    `
  });

  if (error) {
    console.error('Error creating users table:', error);
    return false;
  }
  return true;
}

// Create skin_care_tips table
export async function createSkinCareTipsTable() {
  const { error } = await supabase.rpc('create_skin_care_tips_table', {
    table_name: 'skin_care_tips',
    columns: `
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      description text not null,
      category text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    `
  });

  if (error) {
    console.error('Error creating skin_care_tips table:', error);
    return false;
  }
  return true;
}

// Create products table
export async function createProductsTable() {
  const { error } = await supabase.rpc('create_products_table', {
    table_name: 'products',
    columns: `
      id uuid default uuid_generate_v4() primary key,
      name text not null,
      description text not null,
      category text not null,
      rating float not null,
      image_url text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    `
  });

  if (error) {
    console.error('Error creating products table:', error);
    return false;
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
