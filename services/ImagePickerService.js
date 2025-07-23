import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export class ImagePickerService {
  static async requestPermissions() {
    if (Platform.OS === 'ios') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and photo library permissions are required to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => this.openSettings() }
          ]
        );
        return false;
      }
    }
    return true;
  }

  static async openSettings() {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    }
  }

  static async pickImageFromGallery() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        exif: false,
        outputSize: { width: 224, height: 224 }
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // iOS-specific URI handling
        if (Platform.OS === 'ios') {
          // Ensure we have a valid file URI
          if (asset.uri.startsWith('file://')) {
            return asset.uri;
          } else {
            // Convert asset URI to file URI if needed
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            if (fileInfo.exists) {
              return asset.uri;
            }
          }
        }

        return asset.uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
      return null;
    }
  }

  static async takePhotoWithCamera() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        exif: false,
        outputSize: { width: 224, height: 224 }
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // iOS-specific URI handling
        if (Platform.OS === 'ios') {
          // Ensure we have a valid file URI
          if (asset.uri.startsWith('file://')) {
            return asset.uri;
          } else {
            // Convert asset URI to file URI if needed
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            if (fileInfo.exists) {
              return asset.uri;
            }
          }
        }

        return asset.uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo with camera:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  static async validateImageUri(uri) {
    try {
      if (!uri) return false;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        console.error('Image file does not exist:', uri);
        return false;
      }

      if (fileInfo.size === 0) {
        console.error('Image file is empty:', uri);
        return false;
      }

      // Check file size (max 10MB)
      if (fileInfo.size > 10 * 1024 * 1024) {
        console.error('Image file too large:', fileInfo.size);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating image URI:', error);
      return false;
    }
  }

  static async getImageBase64(uri) {
    try {
      const isValid = await this.validateImageUri(uri);
      if (!isValid) {
        throw new Error('Invalid image URI');
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      return base64;
    } catch (error) {
      console.error('Error getting image base64:', error);
      throw error;
    }
  }
}
