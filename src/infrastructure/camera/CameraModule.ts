import * as ImagePicker from 'expo-image-picker';

/**
 * In a bare workflow production environment, this module would likely be implemented natively:
 * - Android: A custom Native Module CameraModule written in Kotlin interacting with the Android CameraX API.
 * - iOS: A custom Native Module CameraModule written in Swift interacting with AVFoundation.
 */
export class CameraModule {
    static async takePhoto(): Promise<{ uri: string; fileName: string; width: number; height: number; size: number } | null> {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Se requiere permiso para acceder a la cámara.');
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return null; // User cancelled
            }

            const asset = result.assets[0];
            return {
                uri: asset.uri,
                fileName: asset.fileName || `photo_${Date.now()}.jpg`,
                width: asset.width,
                height: asset.height,
                size: asset.fileSize || 0,
            };
        } catch (error) {
            console.error('Error in CameraModule.takePhoto:', error);
            throw error;
        }
    }
}
