import { describe, it, expect } from 'vitest';

// Note: ExpoAuthAdapter requires React Native environment and expo modules.
// These tests are SKIPPED in Node.js environment (CI/CD).
// For full testing, run on actual device or Expo Go.

describe('ExpoAuthAdapter', () => {
  it.skip('should be tested in React Native environment', () => {
    // ExpoAuthAdapter uses:
    // - expo-auth-session (requires native OAuth flow)
    // - expo-secure-store (requires native secure storage)
    // - React hooks (useAuthRequest)
    //
    // These cannot be properly mocked in vitest/Node.js.
    //
    // Testing strategy:
    // 1. Manual testing on real devices (Closed Beta)
    // 2. E2E tests via backend token validation
    // 3. Integration tests with real OAuth providers (optional)
    //
    // See docs/TESTING_STRATEGY.md section 10.1 for details.
    expect(true).toBe(true);
  });

});
