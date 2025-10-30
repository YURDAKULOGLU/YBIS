/**
 * SupabaseAuthAdapter - Supabase Auth implementation of AuthPort
 *
 * Closed Beta: Email/Password + Google OAuth
 * Features:
 * - Email/Password authentication
 * - Google OAuth (via Supabase)
 * - Session management
 * - Auto token refresh
 */

import { createClient, type SupabaseClient, type User as SupabaseUser, type Session } from '@supabase/supabase-js';
import { AuthError } from '@ybis/core';
import type { AuthPort, User, OAuthCredentials, SignInResult } from '@ybis/core';
import Logger from '@ybis/logging';

export interface SupabaseAuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  redirectUrl?: string; // For OAuth (e.g., 'ybis://auth-callback')
}

// Note: EmailPasswordCredentials exported from index.ts
export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

export class SupabaseAuthAdapter implements AuthPort {
  private supabase: SupabaseClient;
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];
  private config: SupabaseAuthConfig;
  private unsubscribe?: () => void;

  constructor(config: SupabaseAuthConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  async initialize(): Promise<void> {
    // Subscribe to auth state changes
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      async (event, session) => {
        Logger.info('[SupabaseAuth] Auth state changed', { type: 'AUTH_STATE', event });
        
        this.currentSession = session;
        
        if (session?.user) {
          this.currentUser = this.mapSupabaseUser(session.user);
        } else {
          this.currentUser = null;
        }
        
        this.notifyAuthStateChanged(this.currentUser);
      }
    );

    this.unsubscribe = () => subscription.unsubscribe();

    // Try to restore session
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session) {
      this.currentSession = session;
      this.currentUser = this.mapSupabaseUser(session.user);
    }
  }

  /**
   * Email/Password Sign Up
   */
  async signUpWithEmail(credentials: EmailPasswordCredentials): Promise<SignInResult> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new AuthError(
          error.message,
          this.mapSupabaseErrorCode(error.status),
          new Error(error.message)
        );
      }

      if (!data.user || !data.session) {
        throw new AuthError(
          'Sign up succeeded but no user/session returned',
          'AUTH_FAILED'
        );
      }

      this.currentSession = data.session;
      this.currentUser = this.mapSupabaseUser(data.user);

      return {
        user: this.currentUser,
        credentials: this.mapSupabaseCredentials(data.session),
        isNewUser: true,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'Failed to sign up with email/password',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  /**
   * Email/Password Sign In
   */
  async signInWithEmail(credentials: EmailPasswordCredentials): Promise<SignInResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new AuthError(
          error.message,
          this.mapSupabaseErrorCode(error.status),
          new Error(error.message)
        );
      }

      if (!data.user || !data.session) {
        throw new AuthError(
          'Sign in succeeded but no user/session returned',
          'AUTH_FAILED'
        );
      }

      this.currentSession = data.session;
      this.currentUser = this.mapSupabaseUser(data.user);

      return {
        user: this.currentUser,
        credentials: this.mapSupabaseCredentials(data.session),
        isNewUser: false,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'Failed to sign in with email/password',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  /**
   * Google OAuth (Supabase hosted)
   */
  async getOAuthRequestConfig(provider: 'google' | 'github' | 'apple'): Promise<unknown> {
    if (provider !== 'google') {
      throw new AuthError(
        `Provider ${provider} not fully supported in Closed Beta`,
        'INVALID_PROVIDER'
      );
    }

    // For Supabase, OAuth is initiated via signInWithOAuth
    // This returns the config that the UI can use
    return {
      provider: 'google',
      redirectTo: this.config.redirectUrl ?? 'ybis://auth-callback',
    };
  }

  /**
   * Initiate Google OAuth flow
   */
  async signInWithGoogle(): Promise<{ url: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: this.config.redirectUrl ?? 'ybis://auth-callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new AuthError(
          error.message,
          'AUTH_FAILED',
          new Error(error.message)
        );
      }

      if (!data.url) {
        throw new AuthError('No OAuth URL returned', 'AUTH_FAILED');
      }

      return { url: data.url };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'Failed to initiate Google OAuth',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  /**
   * Process OAuth callback (for deep linking)
   */
  async processOAuthResponse(
    _provider: 'google' | 'github' | 'apple',
    _response: unknown
  ): Promise<SignInResult> {
    // For Supabase, OAuth callback is handled automatically via onAuthStateChange
    // This method is here for AuthPort compatibility
    
    if (this.currentUser && this.currentSession) {
      return {
        user: this.currentUser,
        credentials: this.mapSupabaseCredentials(this.currentSession),
        isNewUser: false, // TODO: Check metadata
      };
    }

    throw new AuthError(
      'OAuth callback processed but no user session found',
      'AUTH_FAILED'
    );
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        throw new AuthError(
          error.message,
          'AUTH_FAILED',
          new Error(error.message)
        );
      }

      this.currentUser = null;
      this.currentSession = null;
      this.notifyAuthStateChanged(null);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        'Failed to sign out',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }

    // Supabase handles token expiration automatically
    // Check if session is still valid
    const expiresAt = this.currentSession.expires_at;
    if (expiresAt && expiresAt * 1000 < Date.now()) {
      // Token expired, try to refresh
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
    try {
      const { data, error } = await this.supabase.auth.refreshSession();

      if (error || !data.session) {
        throw new AuthError(
          error?.message ?? 'Failed to refresh session',
          'REFRESH_FAILED'
        );
      }

      this.currentSession = data.session;
      return this.mapSupabaseCredentials(data.session);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
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

    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  async revokeSession(): Promise<void> {
    await this.signOut();
    
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private mapSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      displayName: supabaseUser.user_metadata?.['full_name'] 
        ?? supabaseUser.user_metadata?.['name'] 
        ?? null,
      photoURL: supabaseUser.user_metadata?.['avatar_url'] 
        ?? supabaseUser.user_metadata?.['picture'] 
        ?? null,
      emailVerified: supabaseUser.email_confirmed_at !== null,
      createdAt: new Date(supabaseUser.created_at),
      lastLoginAt: new Date(supabaseUser.last_sign_in_at ?? supabaseUser.created_at),
    };
  }

  private mapSupabaseCredentials(session: Session): OAuthCredentials {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      idToken: session.access_token, // Supabase uses same token
      expiresAt: session.expires_at 
        ? new Date(session.expires_at * 1000) 
        : undefined,
      provider: 'google', // Default, TODO: detect from session
    };
  }

  private mapSupabaseErrorCode(status?: number): AuthError['code'] {
    switch (status) {
      case 400:
        return 'AUTH_FAILED';
      case 401:
        return 'NOT_AUTHENTICATED';
      case 422:
        return 'AUTH_FAILED';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  private notifyAuthStateChanged(user: User | null): void {
    this.authStateListeners.forEach((listener) => {
      try {
        listener(user);
      } catch (error) {
        console.error('[SupabaseAuth] Listener error:', error);
      }
    });
  }
}

// Re-export for convenience
export { AuthError } from '@ybis/core';
