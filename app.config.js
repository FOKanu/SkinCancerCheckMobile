import 'dotenv/config';

export default {
  name: "SkinCheckAI",
  slug: "SkinCheckAI",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.skincheckai.app",
    infoPlist: {
      NSCameraUsageDescription: "This app needs camera access to scan skin lesions and medical images for AI analysis.",
      NSPhotoLibraryUsageDescription: "This app needs photo library access to select images for skin lesion analysis.",
      NSPhotoLibraryAddUsageDescription: "This app needs permission to save analyzed images to your photo library.",
      NSMicrophoneUsageDescription: "This app may need microphone access for voice input features.",
      NSLocationWhenInUseUsageDescription: "This app may use location for health tracking features.",
      UIBackgroundModes: ["remote-notification"],
      CFBundleDisplayName: "SkinCheckAI",
      CFBundleName: "SkinCheckAI"
    },
    buildNumber: "1",
    deploymentTarget: "13.0"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.skincheckai.app",
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.INTERNET"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan skin lesions and medical images.",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone for voice input features."
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photo library to select images for analysis.",
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to take photos for analysis."
      }
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photo library.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos to your library.",
        isAccessMediaLocationEnabled: true
      }
    ]
  ],
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    scoringApiUrl: process.env.SCORING_API_URL,
    eas: {
      projectId: "your-project-id"
    }
  },
  owner: "your-expo-username",
  runtimeVersion: {
    policy: "sdkVersion"
  },
  updates: {
    url: "https://u.expo.dev/your-project-id"
  }
};
