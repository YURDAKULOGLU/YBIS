/**
 * AuthPort - Authentication abstraction interface
 *
 * Closed Beta: Firebase Auth → Expo Auth Session (Google OAuth)
 * Open Beta: Custom OAuth + JWT
 *
 * This port allows swapping auth providers without changing app code.
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface OAuthCredentials {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
  provider: 'google' | 'github' | 'apple';
}

export interface SignInResult {
  user: User;
  credentials: OAuthCredentials;
  isNewUser: boolean;
}

/**
 * AuthPort - Abstract interface for authentication
 *
 * Implementations:
 * - ExpoAuthAdapter (Closed Beta) - Expo Auth Session + Google OAuth
 * - FirebaseAuthAdapter (Deprecated) - Firebase Auth
 * - CustomAuthAdapter (Open Beta) - Custom OAuth + JWT
 */
export interface AuthPort {
  /**
   * Initialize auth provider
   */
  initialize(): Promise<void>;

  /**
   * Sign in with OAuth provider
   * @param provider OAuth provider (google, github, apple)
   */
  signInWithOAuth(provider: 'google' | 'github' | 'apple'): Promise<SignInResult>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   * @returns User object or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Refresh access token
   * @returns New credentials with refreshed token
   */
  refreshToken(): Promise<OAuthCredentials>;

  /**
   * Subscribe to auth state changes
   * @param callback Function called when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  /**
   * Revoke all tokens and clear session
   */
  revokeSession(): Promise<void>;
}

/**
 * Custom error types for auth operations
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code:
      | 'AUTH_CANCELLED'      // User cancelled OAuth flow
      | 'AUTH_FAILED'         // OAuth authentication failed
      | 'TOKEN_EXPIRED'       // Access token expired
      | 'REFRESH_FAILED'      // Token refresh failed
      | 'NETWORK_ERROR'       // Network connectivity issue
      | 'INVALID_PROVIDER'    // Unsupported OAuth provider
      | 'NOT_AUTHENTICATED'   // User not logged in
      | 'UNKNOWN_ERROR',      // Unexpected error
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
