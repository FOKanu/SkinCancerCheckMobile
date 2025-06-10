# Skin Cancer Check Mobile App

A mobile application that helps users monitor their skin health using AI-powered analysis. The app provides preliminary assessments of skin conditions and encourages regular professional check-ups.

## Features

- AI-powered skin analysis
- User authentication
- Scan history tracking
- Progress monitoring
- Educational content
- Confidence level indicators
- Professional consultation reminders

## Important Disclaimer

This app is NOT a replacement for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment. If the app detects potential cancer with a confidence level above 55%, please consult a physician immediately.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SkinCheckMobile.git
cd SkinCheckMobile
```

2. Create a `.env` file in the root directory and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SCORING_API_URL=your_scoring_api_url  # URL for the skin lesion scoring API
```

3. Install dependencies:
```bash
npm install
```

4. Create your `app.config.js` file:
```bash
cp app.template.json app.config.js
```
Then update the `extra` section in `app.config.js` with your environment variables:
```javascript
extra: {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  scoringApiUrl: process.env.SCORING_API_URL
}
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. Launch the app
2. Sign in with your credentials
3. Follow the tutorial for important information
4. Use the camera to scan skin areas
5. Review the analysis results
6. Consult a physician if confidence level is above 55%

## Tech Stack

- React Native
- Expo
- Supabase
- React Navigation
- Expo Camera
- React Native Paper

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical professionals for guidance
- Open source community
- AI/ML research community
