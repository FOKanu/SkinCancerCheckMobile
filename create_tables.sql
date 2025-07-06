-- Create predictions table
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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skin_care_tips table
CREATE TABLE IF NOT EXISTS skin_care_tips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  rating FLOAT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create spots table
CREATE TABLE IF NOT EXISTS spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  prediction TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample skin care tips
INSERT INTO skin_care_tips (title, description, category) VALUES
  ('Daily Sun Protection', 'Apply SPF 50+ sunscreen every 2 hours when outdoors.', 'Protection'),
  ('Hydration Reminder', 'Keep your skin hydrated by drinking plenty of water and using moisturizers.', 'Hydration'),
  ('Skin Barrier Support', 'Use products with ceramides to strengthen your skin barrier.', 'Care')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, category, rating, image_url) VALUES
  ('La Roche-Posay Anthelios', 'SPF 50+ Mineral Sunscreen', 'Sunscreen', 4.8, 'https://via.placeholder.com/100'),
  ('CeraVe Moisturizing Cream', 'With Ceramides & Hyaluronic Acid', 'Moisturizer', 4.7, 'https://via.placeholder.com/100'),
  ('Neutrogena Hydro Boost', 'Water Gel Moisturizer', 'Hydration', 4.6, 'https://via.placeholder.com/100')
ON CONFLICT DO NOTHING;

-- Insert sample data for testing
INSERT INTO users (id, name, email) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo User', 'demo@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO spots (user_id, location) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Left Arm'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Right Leg')
ON CONFLICT DO NOTHING;

INSERT INTO scans (spot_id, prediction) VALUES
  ((SELECT id FROM spots LIMIT 1), 'Low Risk'),
  ((SELECT id FROM spots LIMIT 1 OFFSET 1), 'High Risk')
ON CONFLICT DO NOTHING;
