/**
 * ExpoAuthAdapter - Expo Auth Session implementation of AuthPort
 *
 * Phase 0 (Closed Beta): Google OAuth only
 * Uses expo-auth-session for OAuth 2.0 flow
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import type { AuthPort, User, OAuthCredentials, SignInResult } from '@ybis/core';
import { AuthError } from '@ybis/core';

// Warm up browser for faster OAuth (iOS optimization)
WebBrowser.maybeCompleteAuthSession();

export interface ExpoAuthConfig {
  google: {
    clientId: string;
    iosClientId?: string;
    androidClientId?: string;
    webClientId?: string;
  };
  redirectUri?: string;
}

export class ExpoAuthAdapter implements AuthPort {
  private currentUser: User | null = null;
  private credentials: OAuthCredentials | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];
  private config: ExpoAuthConfig;

  constructor(config: ExpoAuthConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Check for existing session in secure storage
    // TODO: Load from expo-secure-store in future implementation
    console.log('[ExpoAuthAdapter] Initialized');
  }

  async signInWithOAuth(provider: 'google' | 'github' | 'apple'): Promise<SignInResult> {
    if (provider !== 'google') {
      throw new AuthError(
        `Provider ${provider} not supported in Closed Beta`,
        'INVALID_PROVIDER'
      );
    }

    try {
      // Create OAuth request
      const redirectUri = this.config.redirectUri || AuthSession.makeRedirectUri({
        scheme: 'ybis',
        path: 'auth/callback',
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const [request, , promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: this.config.google.clientId,
          scopes: [
            'openid',
            'profile',
            'email',
            // Google Workspace scopes (for Open Beta)
            // 'https://www.googleapis.com/auth/gmail.readonly',
            // 'https://www.googleapis.com/auth/calendar',
          ],
          redirectUri,
          responseType: AuthSession.ResponseType.Code,
          usePKCE: true, // Security best practice
        },
        discovery
      );

      // Prompt user for OAuth consent
      const result = await promptAsync();

      if (result.type === 'cancel') {
        throw new AuthError('User cancelled OAuth flow', 'AUTH_CANCELLED');
      }

      if (result.type === 'error') {
        throw new AuthError(
          'OAuth authentication failed',
          'AUTH_FAILED',
          new Error(result.error?.message || 'Unknown error')
        );
      }

      if (result.type !== 'success') {
        throw new AuthError('Unexpected OAuth result', 'UNKNOWN_ERROR');
      }

      // Exchange code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: this.config.google.clientId,
          code: result.params['code'] as string,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery
      );

      // Extract user info from ID token (JWT)
      const idTokenPayload = this.parseJWT(tokenResponse.idToken || '');

      const user: User = {
        id: idTokenPayload.sub,
        email: idTokenPayload.email,
        displayName: idTokenPayload.name || null,
        photoURL: idTokenPayload.picture || null,
        emailVerified: idTokenPayload.email_verified || false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      const credentials: OAuthCredentials = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        idToken: tokenResponse.idToken,
        expiresAt: tokenResponse.expiresIn
          ? new Date(Date.now() + tokenResponse.expiresIn * 1000)
          : undefined,
        provider: 'google',
      };

      // Store in memory (TODO: Persist to expo-secure-store)
      this.currentUser = user;
      this.credentials = credentials;

      // Notify listeners
      this.notifyAuthStateChanged(user);

      return {
        user,
        credentials,
        isNewUser: false, // TODO: Check with backend if user exists
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'Failed to sign in with Google',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  async signOut(): Promise<void> {
    // Revoke token with Google (optional but recommended)
    if (this.credentials?.accessToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${this.credentials.accessToken}`,
          { method: 'POST' }
        );
      } catch (error) {
        console.warn('[ExpoAuthAdapter] Failed to revoke token:', error);
      }
    }

    // Clear session
    this.currentUser = null;
    this.credentials = null;

    // Notify listeners
    this.notifyAuthStateChanged(null);

    // TODO: Clear from expo-secure-store
    console.log('[ExpoAuthAdapter] Signed out');
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.currentUser || !this.credentials) {
      return false;
    }

    // Check token expiry
    if (this.credentials.expiresAt && this.credentials.expiresAt < new Date()) {
      // Token expired, try refresh
      try {
        await this.refreshToken();
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }

  async refreshToken(): Promise<OAuthCredentials> {
    if (!this.credentials?.refreshToken) {
      throw new AuthError('No refresh token available', 'REFRESH_FAILED');
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.google.clientId,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();

      const newCredentials: OAuthCredentials = {
        accessToken: data.access_token,
        refreshToken: this.credentials.refreshToken, // Keep existing refresh token
        idToken: data.id_token,
        expiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000)
          : undefined,
        provider: 'google',
      };

      this.credentials = newCredentials;

      // TODO: Persist to expo-secure-store

      return newCredentials;
    } catch (error) {
      throw new AuthError(
        'Failed to refresh token',
        'REFRESH_FAILED',
        error as Error
      );
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);

    // Immediately call with current state
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  async revokeSession(): Promise<void> {
    await this.signOut();
  }

  // Helper methods

  private notifyAuthStateChanged(user: User | null): void {
    this.authStateListeners.forEach((listener) => {
      try {
        listener(user);
      } catch (error) {
        console.error('[ExpoAuthAdapter] Error in auth state listener:', error);
      }
    });
  }

  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid JWT token format');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new AuthError(
        'Failed to parse ID token',
        'AUTH_FAILED',
        error as Error
      );
    }
  }
}

// Auth error re-export for convenience
export { AuthError } from '@ybis/core';
