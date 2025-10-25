/**
 * Health Routes Tests
 *
 * Tests for /health and /health/ports endpoints
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import healthRoutes from '../health';
import { PortRegistry } from '../../services/PortRegistry';

// Health status type (matches PortRegistry.healthCheck return type)
interface PortHealthStatus {
  overall: boolean;
  database: { healthy: boolean; latency?: number; error?: string };
  llm: { healthy: boolean; latency?: number; error?: string };
  storage: { healthy: boolean; latency?: number; error?: string };
}

// Mock PortRegistry
vi.mock('../../services/PortRegistry', () => ({
  PortRegistry: {
    getInstance: vi.fn(),
  },
}));

describe('Health Routes', () => {
  let app: Hono;

  beforeEach(() => {
    // Create fresh app for each test
    app = new Hono();

    // Mount health routes
    app.route('/health', healthRoutes);

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return basic health status', async () => {
      // Act
      const response = await app.request('/health', {
        method: 'GET',
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('status', 'ok');
      expect(data).toHaveProperty('service', 'ybis-backend');
      expect(data).toHaveProperty('timestamp');

      // Verify timestamp is valid ISO string
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(data.timestamp);
    });
  });

  describe('GET /health/ports', () => {
    it('should return healthy port status when all ports are healthy', async () => {
      // Arrange
      const mockHealthStatus: PortHealthStatus = {
        overall: true,
        database: { healthy: true, latency: 15 },
        llm: { healthy: true, latency: 120 },
        storage: { healthy: true, latency: 45 },
      };

      const mockRegistry = {
        healthCheck: vi.fn().mockResolvedValue(mockHealthStatus),
      };

      vi.mocked(PortRegistry.getInstance).mockReturnValue(mockRegistry as any);

      // Act
      const response = await app.request('/health/ports', {
        method: 'GET',
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.status).toBe('healthy');
      expect(data.ports).toEqual(mockHealthStatus);
      expect(data).toHaveProperty('timestamp');
      expect(mockRegistry.healthCheck).toHaveBeenCalledOnce();
    });

    it('should return degraded status when some ports are unhealthy', async () => {
      // Arrange
      const mockHealthStatus: PortHealthStatus = {
        overall: false,
        database: { healthy: true, latency: 15 },
        llm: { healthy: false, error: 'API connection failed' },
        storage: { healthy: true, latency: 45 },
      };

      const mockRegistry = {
        healthCheck: vi.fn().mockResolvedValue(mockHealthStatus),
      };

      vi.mocked(PortRegistry.getInstance).mockReturnValue(mockRegistry as any);

      // Act
      const response = await app.request('/health/ports', {
        method: 'GET',
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.status).toBe('degraded');
      expect(data.ports.overall).toBe(false);
      expect(data.ports.llm).toEqual({
        healthy: false,
        error: 'API connection failed',
      });
    });

    it('should return 500 on registry error', async () => {
      // Arrange
      const mockRegistry = {
        healthCheck: vi.fn().mockRejectedValue(new Error('Registry initialization failed')),
      };

      vi.mocked(PortRegistry.getInstance).mockReturnValue(mockRegistry as any);

      // Act
      const response = await app.request('/health/ports', {
        method: 'GET',
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();

      expect(data.status).toBe('error');
      expect(data.error).toBe('Registry initialization failed');
      expect(data).toHaveProperty('timestamp');
    });
  });
});
