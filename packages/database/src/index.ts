/**
 * @ybis/database - Database abstraction package
 *
 * Exports:
 * - DatabasePort: Abstract interface for database operations
 * - SupabaseAdapter: Supabase implementation (Closed Beta)
 * - DatabaseError: Standard error type
 * - Types: QueryFilter, QueryOptions, InsertResult, UpdateResult, DeleteResult
 */

// Re-export port interface from @ybis/core
export type {
  DatabasePort,
  QueryFilter,
  QueryOptions,
  InsertResult,
  UpdateResult,
  DeleteResult,
} from '@ybis/core';

// Re-export error class
export { DatabaseError } from '@ybis/core';

// Adapters
export { SupabaseAdapter } from './adapters/SupabaseAdapter';
export type { SupabaseConfig } from './adapters/SupabaseAdapter';
