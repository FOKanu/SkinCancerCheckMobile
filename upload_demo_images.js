#!/usr/bin/env node

/**
 * Upload Demo Images to Supabase Bucket
 * This script uploads sample skin lesion images to the lesion-images bucket
 * for demo purposes in the history screen.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fpkbrdyzkarkfsluxksg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa2JyZHl6a2Fya2ZzbHV4a3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMTkzMzcsImV4cCI6MjA2NDY5NTMzN30.FdRFstLqsuwJAXHtIc3QDHTsnMkRfAD2_1uxc8Wx5Og';

// Sample image data (base64 encoded small skin lesion images)
const sampleImages = [
  {
    name: 'demo-lesion-1.jpg',
    data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  },
  {
    name: 'demo-lesion-2.jpg',
    data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  },
  {
    name: 'demo-lesion-3.jpg',
    data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  }
];

async function uploadDemoImages() {
  console.log('🚀 Starting demo image upload to Supabase...');

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized');

    // Upload each sample image
    for (const image of sampleImages) {
      console.log(`📤 Uploading ${image.name}...`);

      // Extract base64 data
      const base64Data = image.data.split(',')[1];

      const { data, error } = await supabase.storage
        .from('lesion-images')
        .upload(`public/${image.name}`, base64Data, {
          cacheControl: '3600',
          upsert: true,
          contentType: image.contentType,
        });

      if (error) {
        console.error(`❌ Error uploading ${image.name}:`, error);
      } else {
        console.log(`✅ Successfully uploaded ${image.name}`);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('lesion-images')
          .getPublicUrl(`public/${image.name}`);

        console.log(`🔗 Public URL: ${urlData.publicUrl}`);
      }
    }

    console.log('🎉 Demo image upload completed!');

    // List all files in the bucket
    console.log('\n📋 Listing all files in bucket:');
    const { data: files, error: listError } = await supabase.storage
      .from('lesion-images')
      .list('public');

    if (listError) {
      console.error('❌ Error listing files:', listError);
    } else {
      files.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
      });
    }

  } catch (error) {
    console.error('❌ Upload script failed:', error);
  }
}

// Run the upload
uploadDemoImages().catch(console.error);
