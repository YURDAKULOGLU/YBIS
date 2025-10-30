/**
 * useAuth Hook - Supabase Auth Integration
 *
 * Provides authentication state and methods for the mobile app
 */

import { useState, useEffect, useCallback } from 'react';
import { SupabaseAuthAdapter, type EmailPasswordCredentials } from '@ybis/auth';
import type { User } from '@ybis/core';
import Constants from 'expo-constants';

// Singleton auth adapter
let authAdapter: SupabaseAuthAdapter | null = null;

const supabaseUrl = Constants.expoConfig?.extra?.['supabaseUrl'];
const supabaseAnonKey = Constants.expoConfig?.extra?.['supabaseAnonKey'];

function getAuthAdapter(): SupabaseAuthAdapter | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!authAdapter) {
    authAdapter = new SupabaseAuthAdapter({
      supabaseUrl,
      supabaseAnonKey,
      redirectUrl: 'ybis://auth-callback',
    });

    // Initialize adapter (fire and forget; login calls will await later)
    void authAdapter.initialize().catch((err) => {
      console.error('Supabase auth adapter initialization failed:', err);
    });
  }

  return authAdapter;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signUpWithEmail: (credentials: EmailPasswordCredentials) => Promise<void>;
  signInWithEmail: (credentials: EmailPasswordCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const adapter = getAuthAdapter();

    if (!adapter) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = adapter.onAuthStateChanged((newUser: User | null) => {
      setUser(newUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [supabaseUrl, supabaseAnonKey]);

  const signUpWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials) => {
      const adapter = getAuthAdapter();
      if (!adapter) {
        const message = 'Supabase credentials are not configured for this build.';
        setError(message);
        throw new Error(message);
      }

      try {
        setLoading(true);
        setError(null);
        await adapter.signUpWithEmail(credentials);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Sign up failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError]
  );

  const signInWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials) => {
      const adapter = getAuthAdapter();
      if (!adapter) {
        const message = 'Supabase credentials are not configured for this build.';
        setError(message);
        throw new Error(message);
      }

      try {
        setLoading(true);
        setError(null);
        await adapter.signInWithEmail(credentials);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Sign in failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError]
  );

  const signInWithGoogle = useCallback(async () => {
    const adapter = getAuthAdapter();
    if (!adapter) {
      const message = 'Supabase credentials are not configured for this build.';
      setError(message);
      throw new Error(message);
    }

    try {
      setLoading(true);
      setError(null);
      await adapter.signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const adapter = getAuthAdapter();
    if (!adapter) {
      const message = 'Supabase credentials are not configured for this build.';
      setError(message);
      throw new Error(message);
    }

    try {
      setLoading(true);
      setError(null);
      await adapter.signOut();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    clearError,
  };
}
