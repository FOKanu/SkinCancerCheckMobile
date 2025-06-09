import { initializeDatabase } from './services/DatabaseService';

// Initialize the database
initializeDatabase()
  .then((success) => {
    if (success) {
      console.log('Database initialization completed successfully');
    } else {
      console.error('Database initialization failed');
    }
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
  });
