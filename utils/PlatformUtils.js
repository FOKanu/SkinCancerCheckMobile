import { Platform, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export class PlatformUtils {
  static isIOS = Platform.OS === 'ios';
  static isAndroid = Platform.OS === 'android';

  static async requestCameraPermissions() {
    if (this.isIOS) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    return true; // Android handles permissions differently
  }

  static async requestPhotoLibraryPermissions() {
    if (this.isIOS) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
    return true; // Android handles permissions differently
  }

  static async openAppSettings() {
    if (this.isIOS) {
      await Linking.openURL('app-settings:');
    } else if (this.isAndroid) {
      await Linking.openSettings();
    }
  }

  static showPermissionAlert() {
    Alert.alert(
      'Permissions Required',
      'Camera and photo library permissions are required to use this feature.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => this.openAppSettings() }
      ]
    );
  }

  static getImagePickerOptions() {
    const baseOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
      exif: false,
    };

    if (this.isIOS) {
      return {
        ...baseOptions,
        outputSize: { width: 224, height: 224 }
      };
    }

    return baseOptions;
  }

  static validateImageUri(uri) {
    if (!uri) return false;

    // iOS specific validation
    if (this.isIOS) {
      return uri.startsWith('file://') || uri.startsWith('assets-library://');
    }

    // Android specific validation
    if (this.isAndroid) {
      return uri.startsWith('file://') || uri.startsWith('content://');
    }

    return true;
  }

  static getErrorMessage(error) {
    if (this.isIOS) {
      // iOS specific error messages
      if (error.message.includes('permission')) {
        return 'Camera or photo library permission denied. Please enable in Settings.';
      }
      if (error.message.includes('file')) {
        return 'Unable to access image file. Please try selecting a different image.';
      }
    }

    return error.message || 'An unexpected error occurred.';
  }

  static getPlatformSpecificStyles() {
    return {
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      }
    };
  }
}
