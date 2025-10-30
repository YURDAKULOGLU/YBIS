/**
 * @ybis/auth - Authentication package
 *
 * Public API - All exports for mobile/backend apps
 */

// Core types from @ybis/core
export type {
  AuthPort,
  User,
  OAuthCredentials,
  SignInResult,
} from '@ybis/core';

export { AuthError } from '@ybis/core';

// Adapters
export { ExpoAuthAdapter } from './adapters/ExpoAuthAdapter';
export type { ExpoAuthConfig } from './adapters/ExpoAuthAdapter';

export { SupabaseAuthAdapter } from './adapters/SupabaseAuthAdapter';
export type {
  SupabaseAuthConfig,
  EmailPasswordCredentials,
} from './adapters/SupabaseAuthAdapter';
