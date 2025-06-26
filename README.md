# Skin Cancer Check Mobile App

A comprehensive React Native mobile application that helps users monitor their skin health using AI-powered analysis. The app provides preliminary assessments of skin lesions and encourages regular professional check-ups.

## 🏥 Important Medical Disclaimer

**This app is NOT a replacement for professional medical advice.** Always consult with a healthcare provider for proper diagnosis and treatment. If the app detects potential concerns with a confidence level above 55%, please consult a physician immediately.

## 📱 Features

### Core Functionality
- **AI-Powered Skin Analysis**: Upload or capture skin lesion images for preliminary assessment
- **User Authentication**: Secure login system with Supabase backend
- **Scan History Tracking**: Complete history of all skin scans with results
- **Progress Monitoring**: Statistics and trends of your skin health journey
- **Educational Content**: Skin care tips and educational resources
- **Confidence Level Indicators**: Clear confidence scores for each prediction
- **Professional Consultation Reminders**: Built-in reminders for medical check-ups

### Additional Features
- **Schedule Management**: Calendar view for appointment booking
- **AI Tips Screen**: Personalized recommendations based on scan history
- **Alert System**: Important notifications and health reminders
- **Tutorial System**: Comprehensive onboarding for new users
- **Multi-platform Support**: iOS, Android, and Web compatibility

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **AI/ML**: Remote API service (Google Cloud Run)
- **Navigation**: React Navigation v6
- **State Management**: React Hooks
- **Image Processing**: Expo Image Picker
- **Calendar**: react-native-calendars

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Supabase      │    │   ML API        │
│   (React Native)│◄──►│   (Backend)     │    │   (Cloud Run)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   Database      │    │   ML Model      │
│   - Screens     │    │   - Users       │    │   - Predictions │
│   - Navigation  │    │   - Scans       │    │   - Confidence  │
│   - Components  │    │   - History     │    │   - Probabilities│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for Mac) or Android Emulator
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/FOKanu/SkinCancerCheckMobile.git
cd SkinCancerCheckMobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SCORING_API_URL=your_scoring_api_url
```

### 4. Database Setup
Initialize the database tables:
```bash
node initDb.js
```

### 5. Start Development Server
```bash
npm start
```

### 6. Run the App
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal
- **Physical Device**: Scan QR code with Expo Go app

## 📁 Project Structure

```
SkinCancerCheckMobile/
├── assets/                 # Images, icons, and static assets
│   ├── icon.png
│   ├── splash-icon.png
│   ├── sample1.jpg
│   └── Skin check ai logo.png
├── components/             # Reusable UI components
│   └── TutorialModal.js
├── screens/               # Main application screens
│   ├── LoginScreen.js
│   ├── TutorialScreen.js
│   ├── ScanScreen.js
│   ├── ResultsScreen.js
│   ├── HistoryScreen.js
│   ├── ProgressScreen.js
│   ├── EducationScreen.js
│   ├── ScheduleScreen.js
│   ├── AITipsScreen.js
│   └── AlertScreen.js
├── services/              # Business logic and API services
│   ├── ApiService.js      # ML API integration
│   ├── AuthService.js     # Authentication logic
│   ├── DatabaseService.js # Database operations
│   └── PredictionService.js # Prediction handling
├── supabaseClient.js      # Supabase client configuration
├── App.js                 # Main application component
├── app.config.js          # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md              # This documentation
```

## 🔧 Configuration

### Environment Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SCORING_API_URL`: URL for the ML prediction API

### App Configuration (app.config.js)
```javascript
export default {
  name: "SkinCancerCheckMobile",
  slug: "SkinCancerCheckMobile",
  version: "1.0.0",
  orientation: "portrait",
  // ... additional configuration
}
```

## 🧠 ML/AI Integration

### Prediction System
The app uses a remote ML API for skin lesion analysis:

- **API Endpoint**: `https://model-inference-api-521423942017.europe-west1.run.app`
- **Input**: Skin lesion images (224x224 pixels)
- **Output**: Prediction class (0 = Low Risk, 1 = High Risk) + confidence score
- **Response Format**:
  ```json
  {
    "predicted_class": 0,
    "confidence": 0.92,
    "status": "success"
  }
  ```

### Prediction Identifiers
The app uses consistent terminology throughout:
- **Low Risk**: Previously "benign" lesions
- **High Risk**: Previously "malignant" lesions
- **Confidence**: Probability score (0-1) indicating prediction certainty

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

### Scans Table
```sql
CREATE TABLE scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  spot_id UUID REFERENCES spots(id),
  image_url TEXT NOT NULL,
  prediction TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  low_risk_probability FLOAT NOT NULL,
  high_risk_probability FLOAT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Spots Table
```sql
CREATE TABLE spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Authentication

The app uses Supabase Authentication with:
- Email/password authentication
- Session management
- User profile storage
- Secure API access

## 📊 Key Features Deep Dive

### 1. Scan Screen
- Camera integration for photo capture
- Image picker for gallery selection
- Image preprocessing (224x224 resize)
- Real-time analysis with ML API

### 2. Results Screen
- Prediction display with confidence scores
- Probability breakdown (Low Risk vs High Risk)
- Save to new spot or link to existing spot
- Professional consultation recommendations

### 3. History Screen
- Complete scan history with thumbnails
- Filter and search capabilities
- Detailed result viewing
- Export functionality

### 4. Progress Screen
- Statistical overview of scan history
- Risk level distribution charts
- Confidence trend analysis
- Monthly progress tracking

## 🚨 Error Handling

The app includes comprehensive error handling for:
- Network connectivity issues
- API failures
- Authentication errors
- Image processing errors
- Database connection problems

## 🔄 State Management

Uses React Hooks for state management:
- `useState` for local component state
- `useEffect` for side effects and lifecycle management
- Custom hooks for reusable logic
- Context API for global state (if needed)

## 📱 Platform Support

- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo
- **Web**: Progressive Web App (PWA) support
- **Development**: Hot reloading and debugging tools

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Image capture and upload
- [ ] ML prediction accuracy
- [ ] History tracking
- [ ] Progress statistics
- [ ] Error handling
- [ ] Cross-platform compatibility

### Automated Testing (Future)
- Unit tests for services
- Integration tests for API calls
- E2E tests for user flows
- Performance testing

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

### App Store Deployment
1. Configure app signing
2. Build production version
3. Submit to App Store/Play Store
4. Configure CI/CD pipeline

## 🔧 Troubleshooting

### Common Issues

1. **Metro Bundler Issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependency Conflicts**
   ```bash
   npm install --force
   ```

3. **Environment Variables**
   - Ensure `.env` file exists
   - Check variable names match `app.config.js`

4. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity
   - Run `node initDb.js` to reset tables

### Performance Optimization
- Image compression before upload
- Lazy loading for history screens
- Efficient database queries
- Memory management for large image sets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow React Native best practices
- Use TypeScript for new features
- Add comprehensive error handling
- Include unit tests for new functionality
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical professionals for guidance and validation
- Open source community for tools and libraries
- AI/ML research community for model development
- Supabase team for backend infrastructure
- Expo team for development platform

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section above

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added Schedule and AI Tips screens
- **v1.2.0**: Updated prediction identifiers and improved UI
- **v1.3.0**: Enhanced error handling and performance optimizations

---

**Last Updated**: December 2024
**Maintainer**: Development Team
**Repository**: https://github.com/FOKanu/SkinCancerCheckMobile
