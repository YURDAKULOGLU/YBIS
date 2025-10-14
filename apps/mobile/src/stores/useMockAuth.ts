import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

/**
 * Mock Authentication Store (Demo/Development Only)
 *
 * This store provides fake authentication for UI testing.
 * Real authentication will be implemented in Story 2.1 (Supabase Auth).
 *
 * Features:
 * - Demo login (no actual auth)
 * - Persisted auth state (SecureStore)
 * - Logout functionality
 *
 * @warning DO NOT USE IN PRODUCTION - This bypasses all security
 */

const MOCK_AUTH_KEY = 'ybis_mock_auth';

interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface MockAuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  isLoading: boolean;

  // Actions
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const DEMO_USER: MockUser = {
  id: 'demo-user-001',
  email: 'demo@ybis.app',
  name: 'Demo User',
  avatar: undefined,
};

export const useMockAuth = create<MockAuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  /**
   * Demo Login - Sets authenticated state without real auth
   */
  loginDemo: async () => {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to SecureStore
      await SecureStore.setItemAsync(MOCK_AUTH_KEY, JSON.stringify(DEMO_USER));

      set({
        isAuthenticated: true,
        user: DEMO_USER,
        isLoading: false,
      });
    } catch (error) {
      console.error('[MockAuth] Login failed:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Logout - Clears auth state
   */
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(MOCK_AUTH_KEY);

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('[MockAuth] Logout failed:', error);
    }
  },

  /**
   * Check Auth - Loads persisted auth state on app start
   */
  checkAuth: async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(MOCK_AUTH_KEY);

      if (storedUser) {
        const user: MockUser = JSON.parse(storedUser);
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('[MockAuth] Check auth failed:', error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },
}));
