/**
 * ExpoAuthAdapter - Expo Auth Session implementation of AuthPort
 *
 * Phase 0 (Closed Beta): Google OAuth only
 * Uses expo-auth-session for OAuth 2.0 flow
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AuthError } from '@ybis/core';
import type { AuthPort, User, OAuthCredentials, SignInResult } from '@ybis/core';

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

// This is now a static configuration, not a dynamic hook call.
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export class ExpoAuthAdapter implements AuthPort {
  private currentUser: User | null = null;
  private credentials: OAuthCredentials | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];
  private config: ExpoAuthConfig;

  constructor(config: ExpoAuthConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // TODO: Load from expo-secure-store in future implementation
  }

  async getOAuthRequestConfig(provider: 'google' | 'github' | 'apple'): Promise<unknown> {
    if (provider !== 'google') {
      throw new AuthError(
        `Provider ${provider} not supported in Closed Beta`,
        'INVALID_PROVIDER'
      );
    }

    const redirectUri = this.config.redirectUri ?? AuthSession.makeRedirectUri({
      scheme: 'ybis',
      path: 'auth/callback',
    });

    // This method now returns a plain config object for the UI to use.
    return {
      clientId: this.config.google.clientId,
      scopes: [
        'openid',
        'profile',
        'email',
      ],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    };
  }

  async processOAuthResponse(
    provider: 'google' | 'github' | 'apple',
    response: unknown
  ): Promise<SignInResult> {
    if (provider !== 'google') {
      throw new AuthError(
        `Provider ${provider} not supported in Closed Beta`,
        'INVALID_PROVIDER'
      );
    }

    const authResponse = response as AuthSession.AuthSessionResult;

    try {
      if (authResponse.type === 'cancel') {
        throw new AuthError('User cancelled OAuth flow', 'AUTH_CANCELLED');
      }

      if (authResponse.type === 'error') {
        throw new AuthError(
          'OAuth authentication failed',
          'AUTH_FAILED',
          new Error(authResponse.error?.message ?? 'Unknown error')
        );
      }

      if (authResponse.type !== 'success') {
        throw new AuthError('Unexpected OAuth result', 'UNKNOWN_ERROR');
      }

      // This logic is now testable by passing a mock response object.
      const code = authResponse.params['code'];
      const codeVerifier = authResponse.params['code_verifier'];
      
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: this.config.google.clientId,
          code: typeof code === 'string' ? code : '',
          redirectUri: this.config.redirectUri ?? AuthSession.makeRedirectUri({
            scheme: 'ybis',
            path: 'auth/callback',
          }),
          extraParams: {
            code_verifier: typeof codeVerifier === 'string' ? codeVerifier : '',
          },
        },
        discovery
      );

      const idTokenPayload = this.parseJWT(tokenResponse.idToken ?? '');

      const user: User = {
        id: idTokenPayload['sub'] as string,
        email: idTokenPayload['email'] as string,
        displayName: (idTokenPayload['name'] as string) ?? null,
        photoURL: (idTokenPayload['picture'] as string) ?? null,
        emailVerified: (idTokenPayload['email_verified'] as boolean) ?? false,
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

      this.currentUser = user;
      this.credentials = credentials;
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
        'Failed to process Google OAuth response',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  async signOut(): Promise<void> {
    if (this.credentials?.accessToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${this.credentials.accessToken}`,
          { method: 'POST' }
        );
      } catch {
        // Don't block sign-out if revoke fails
      }
    }
    this.currentUser = null;
    this.credentials = null;
    this.notifyAuthStateChanged(null);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.currentUser || !this.credentials) {
      return false;
    }
    if (this.credentials.expiresAt && this.credentials.expiresAt < new Date()) {
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
        refreshToken: this.credentials.refreshToken,
        idToken: data.id_token,
        expiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000)
          : undefined,
        provider: 'google',
      };

      this.credentials = newCredentials;
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
    callback(this.currentUser);
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

  private notifyAuthStateChanged(user: User | null): void {
    this.authStateListeners.forEach((listener) => {
      try {
        listener(user);
      } catch {
        // Don't let one listener break the others
      }
    });
  }

  private parseJWT(token: string): Record<string, unknown> {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid JWT token format');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload) as Record<string, unknown>;
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
