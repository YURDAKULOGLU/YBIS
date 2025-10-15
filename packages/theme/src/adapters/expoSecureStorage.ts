/**
 * Expo SecureStore Adapter for Zustand Persist
 *
 * Bridges expo-secure-store API to zustand's persist middleware interface.
 * expo-secure-store uses async get/set, while zustand expects AsyncStorage-like interface.
 *
 * Why expo-secure-store (not AsyncStorage):
 * - Expo managed workflow compatible
 * - More secure (uses Keychain on iOS, EncryptedSharedPreferences on Android)
 * - Better for sensitive data (theme preferences included)
 *
 * Architecture:
 * - No StoragePort needed (Expo is the framework, not swappable)
 * - Direct adapter pattern for API compatibility
 */

import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

/**
 * Expo SecureStore adapter for zustand persist middleware
 *
 * Implements zustand's StateStorage interface using expo-secure-store
 */
export const expoSecureStorage: StateStorage = {
  /**
   * Get item from secure storage
   * @param name - Storage key
   * @returns Promise resolving to stored value or null
   */
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error(`[ExpoSecureStorage] Error getting item "${name}":`, error);
      return null;
    }
  },

  /**
   * Set item in secure storage
   * @param name - Storage key
   * @param value - Value to store (will be JSON stringified by zustand)
   */
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error(`[ExpoSecureStorage] Error setting item "${name}":`, error);
    }
  },

  /**
   * Remove item from secure storage
   * @param name - Storage key
   */
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error(`[ExpoSecureStorage] Error removing item "${name}":`, error);
    }
  },
};
