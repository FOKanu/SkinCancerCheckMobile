# 🍎 iOS Setup Guide for SkinCheckAI

## **Prerequisites**
- macOS with Xcode installed
- iOS device or simulator running iOS 13.0+
- Latest version of Expo Go from App Store
- Node.js and npm/yarn

## **Quick Start for iOS**

### **1. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **2. Start Development Server**
```bash
# For better iOS compatibility, use tunnel mode
expo start --tunnel

# Or use local network
expo start --lan
```

### **3. Connect iOS Device**
- Open Expo Go app on your iOS device
- Scan the QR code from the terminal
- Grant camera and photo library permissions when prompted

## **iOS-Specific Configuration**

### **Permissions Setup**
The app now includes proper iOS permissions in `app.config.js`:
- Camera access for taking photos
- Photo library access for selecting images
- Microphone access for future voice features
- Location access for health tracking

### **File Handling**
- iOS-specific image URI handling
- Proper file validation for iOS
- Cross-platform image picker service

## **Troubleshooting iOS Issues**

### **Common Issues and Solutions**

#### **1. "Camera permission denied"**
**Solution**:
- Go to iOS Settings > Privacy & Security > Camera
- Enable camera access for Expo Go
- Restart the app

#### **2. "Photo library access denied"**
**Solution**:
- Go to iOS Settings > Privacy & Security > Photos
- Enable photo library access for Expo Go
- Restart the app

#### **3. "Image picker not working"**
**Solution**:
- Ensure you're using the latest Expo Go version
- Try clearing Expo Go cache and restarting
- Use tunnel mode: `expo start --tunnel`

#### **4. "App crashes on image selection"**
**Solution**:
- Check console logs for specific error messages
- Ensure image file is valid and not corrupted
- Try selecting a different image

#### **5. "Network requests failing"**
**Solution**:
- Use tunnel mode for better network connectivity
- Check if your API endpoint is accessible
- Ensure proper CORS configuration on your API

## **Development Build (Recommended)**

For better iOS compatibility, consider using a development build:

### **1. Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### **2. Login to Expo**
```bash
eas login
```

### **3. Configure EAS**
```bash
eas build:configure
```

### **4. Build for iOS**
```bash
eas build --platform ios --profile development
```

### **5. Install Development Build**
- Download the .ipa file from EAS
- Install on your iOS device using Xcode or TestFlight

## **Testing Checklist**

### **Before Testing**
- [ ] Latest Expo Go installed
- [ ] iOS device running iOS 13.0+
- [ ] Camera and photo permissions granted
- [ ] Network connectivity established

### **Test Scenarios**
- [ ] App launches without crashes
- [ ] Camera permission request appears
- [ ] Photo library permission request appears
- [ ] Image picker opens successfully
- [ ] Camera opens successfully
- [ ] Image analysis works
- [ ] Results display correctly
- [ ] History saves properly

## **Performance Optimization for iOS**

### **Image Processing**
- Images are automatically resized to 224x224 for analysis
- Quality is set to 0.8 for optimal performance
- File size validation prevents oversized uploads

### **Memory Management**
- Images are processed efficiently
- Temporary files are cleaned up automatically
- Memory usage is optimized for iOS

## **Debug Mode**

To enable debug logging for iOS:

```bash
# Start with debug logging
expo start --tunnel --dev-client

# Check logs in terminal or Expo DevTools
```

## **Support**

If you encounter iOS-specific issues:

1. Check the console logs for error messages
2. Verify all permissions are granted
3. Try using tunnel mode
4. Consider using a development build
5. Check Expo documentation for iOS-specific issues

## **Notes**

- iOS 13.0+ is required for full functionality
- Some features may work differently on iOS vs Android
- Camera and photo library permissions are mandatory
- Network connectivity is required for image analysis
