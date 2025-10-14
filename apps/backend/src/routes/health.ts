/**
 * Health check routes
 */

import { Hono } from 'hono';
import { PortRegistry } from '../services/PortRegistry';

const health = new Hono();

/**
 * GET /health
 * Basic health check endpoint
 */
health.get('/', async (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ybis-backend',
  });
});

/**
 * GET /health/ports
 * Check health of all port adapters
 */
health.get('/ports', async (c) => {
  try {
    const registry = PortRegistry.getInstance();
    const health = await registry.healthCheck();

    return c.json({
      status: health.overall ? 'healthy' : 'degraded',
      ports: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
});

export default health;
