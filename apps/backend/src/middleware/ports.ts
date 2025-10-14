/**
 * Hono middleware to inject ports into request context
 *
 * Makes all ports available to route handlers via c.get()
 */

import { Context, Next } from 'hono';
import { PortRegistry } from '../services/PortRegistry';

/**
 * Middleware to inject ports into Hono context
 */
export async function portsMiddleware(c: Context, next: Next) {
  const registry = PortRegistry.getInstance();

  // Attach ports to context
  c.set('database', registry.database);
  c.set('llm', registry.llm);
  c.set('storage', registry.storage);

  await next();
}

/**
 * Type helper for accessing ports in route handlers
 */
declare module 'hono' {
  interface ContextVariableMap {
    database: import('@ybis/database').DatabasePort;
    llm: import('@ybis/llm').LLMPort;
    storage: import('@ybis/storage').StoragePort;
  }
}
