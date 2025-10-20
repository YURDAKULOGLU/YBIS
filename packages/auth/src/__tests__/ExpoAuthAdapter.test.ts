import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthError } from '@ybis/core';

// Mock expo-web-browser
vi.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: vi.fn(),
}));

// Mock expo-auth-session
vi.mock('expo-auth-session', () => ({
  makeRedirectUri: vi.fn(() => 'ybis://auth/callback'),
  exchangeCodeAsync: vi.fn(),
  ResponseType: { Code: 'code' },
}));

// Import after mocks
import { ExpoAuthAdapter } from '../adapters/ExpoAuthAdapter';
import * as AuthSession from 'expo-auth-session';

const mockConfig = {
  google: {
    clientId: 'test-client-id',
  },
};

describe('ExpoAuthAdapter', () => {
  let adapter: ExpoAuthAdapter;

  beforeEach(() => {
    adapter = new ExpoAuthAdapter(mockConfig);
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('getOAuthRequestConfig', () => {
    it('should return the correct config for google provider', async () => {
      const config = await adapter.getOAuthRequestConfig('google');
      expect(config).toEqual({
        clientId: 'test-client-id',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: 'ybis://auth/callback',
        responseType: 'code',
        usePKCE: true,
      });
    });

    it('should throw for an unsupported provider', async () => {
      await expect(adapter.getOAuthRequestConfig('github' as 'google')).rejects.toThrow(
        new AuthError('Provider github not supported in Closed Beta', 'INVALID_PROVIDER')
      );
    });
  });

  describe('processOAuthResponse', () => {
    it('should throw AuthError on a "cancel" response', async () => {
      const mockResponse = { type: 'cancel' };
      await expect(adapter.processOAuthResponse('google', mockResponse)).rejects.toThrow(
        new AuthError('User cancelled OAuth flow', 'AUTH_CANCELLED')
      );
    });

    it('should throw AuthError on an "error" response', async () => {
      const mockResponse = { type: 'error', error: { message: 'Test error' } };
      await expect(adapter.processOAuthResponse('google', mockResponse)).rejects.toThrow(
        new AuthError('OAuth authentication failed', 'AUTH_FAILED')
      );
    });

    it('should process a "success" response and return user data', async () => {
      // Arrange
      const mockSuccessResponse = {
        type: 'success',
        params: {
          code: 'test-auth-code',
          code_verifier: 'test-verifier',
        },
      };

      const mockTokenResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        idToken: `header.${Buffer.from(JSON.stringify({ sub: '123', email: 'test@test.com', name: 'Test User', picture: 'url', email_verified: true })).toString('base64')}.signature`,
        expiresIn: 3600,
      };

      vi.mocked(AuthSession.exchangeCodeAsync).mockResolvedValue(mockTokenResponse as any);

      // Act
      const result = await adapter.processOAuthResponse('google', mockSuccessResponse);

      // Assert
      expect(AuthSession.exchangeCodeAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'test-auth-code',
          clientId: 'test-client-id',
        }),
        expect.any(Object)
      );

      expect(result.user.id).toBe('123');
      expect(result.user.email).toBe('test@test.com');
      expect(result.credentials.accessToken).toBe('test-access-token');
    });

     it('should throw if token exchange fails', async () => {
      // Arrange
      const mockSuccessResponse = { 
        type: 'success', 
        params: { 
          code: 'test-code',
          code_verifier: 'test-verifier'
        } 
      };
      vi.mocked(AuthSession.exchangeCodeAsync).mockRejectedValue(new Error('Exchange failed'));

      // Act & Assert
      await expect(adapter.processOAuthResponse('google', mockSuccessResponse)).rejects.toThrow(
        new AuthError('Failed to process Google OAuth response', 'AUTH_FAILED')
      );
    });
  });
});
