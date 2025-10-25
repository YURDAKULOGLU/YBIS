/**
 * YBIS Backend - Hono Server with Port Architecture
 *
 * Closed Beta: Tier 1 Ports
 * - AuthPort (Expo Auth Session)
 * - DatabasePort (Supabase PostgreSQL)
 * - LLMPort (OpenAI GPT-4o-mini)
 * - StoragePort (Supabase Storage)
 */

import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import Logger from '@ybis/logging';
import { PortRegistry } from './services/PortRegistry';
import { portsMiddleware } from './middleware/ports';

// Routes
import health from './routes/health';
import llm from './routes/llm';

// Environment validation
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Hono app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:8081', 'http://localhost:3000'], // Expo + Web dev servers
    credentials: true,
  })
);

// Initialize ports before handling requests
let portsReady = false;

app.use('*', async (c, next) => {
  if (!portsReady) {
    return c.json(
      {
        error: 'Server is initializing. Please try again in a moment.',
      },
      503
    );
  }
  return await next();
});

// Inject ports into context for all routes
app.use('*', portsMiddleware);

// Routes
app.route('/health', health);
app.route('/api/llm', llm);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    service: 'YBIS Backend',
    version: '0.1.0',
    phase: 'Closed Beta',
    ports: {
      auth: 'Expo Auth Session',
      database: 'Supabase PostgreSQL',
      llm: 'OpenAI GPT-4o-mini',
      storage: 'Supabase Storage',
    },
    docs: '/docs',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`, err);
  return c.json(
    {
      error: err.message ?? 'Internal Server Error',
    },
    500
  );
});

// Initialize server
const PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 3001;

async function startServer(): Promise<void> {
  try {
    console.warn('🚀 YBIS Backend starting...\n');

    // Initialize all ports
    console.warn('📦 Initializing ports...');
    const registry = PortRegistry.getInstance({
      supabaseUrl: process.env['SUPABASE_URL']!,
      supabaseAnonKey: process.env['SUPABASE_ANON_KEY']!,
      supabaseServiceKey: process.env['SUPABASE_SERVICE_KEY'],
      openaiApiKey: process.env['OPENAI_API_KEY']!,
      openaiModel: process.env['OPENAI_MODEL'] ?? 'gpt-4o-mini',
    });

    await registry.initialize();
    portsReady = true;

    Logger.info('All ports initialized successfully', { type: 'LIFECYCLE' });

    // Start HTTP server
    serve(
      {
        fetch: app.fetch,
        port: PORT,
      },
      (info) => {
        Logger.info(`Server running at http://localhost:${info.port}`, { type: 'LIFECYCLE' });
        Logger.info('Available endpoints:', {
          type: 'LIFECYCLE',
          endpoints: [
            'GET  /health              - Basic health check',
            'GET  /health/ports        - Port health status',
            'POST /api/llm/generate    - Generate text (GPT-4o-mini)',
            'POST /api/llm/chat        - Chat with AI',
            'POST /api/llm/embed       - Create embeddings',
          ],
        });
      }
    );
  } catch (error) {
    Logger.error('Failed to start server', error as Error, { type: 'LIFECYCLE' });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  Logger.info('Shutting down gracefully (SIGINT)', { type: 'LIFECYCLE' });
  // Close database connections if needed
  process.exit(0);
});

process.on('SIGTERM', () => {
  Logger.info('Shutting down gracefully (SIGTERM)', { type: 'LIFECYCLE' });
  process.exit(0);
});

// Start the server
void startServer();
