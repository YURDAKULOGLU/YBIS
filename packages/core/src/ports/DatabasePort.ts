/**
 * DatabasePort - Database abstraction interface
 *
 * Closed Beta: Supabase PostgreSQL
 * MVP: Google Cloud SQL (PostgreSQL)
 *
 * This port allows swapping database providers without changing app code.
 */

export interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

export interface InsertResult<T = any> {
  data: T;
  id: string;
}

export interface UpdateResult<T = any> {
  data: T;
  count: number;
}

export interface DeleteResult {
  count: number;
}

/**
 * DatabasePort - Abstract interface for database operations
 *
 * Implementations:
 * - SupabaseAdapter (Closed Beta)
 * - CloudSQLAdapter (MVP) - Google Cloud SQL
 * - MockDatabaseAdapter (Testing)
 */
export interface DatabasePort {
  /**
   * Initialize database connection
   */
  initialize(): Promise<void>;

  /**
   * Close database connection
   */
  close(): Promise<void>;

  /**
   * Check connection health
   */
  healthCheck(): Promise<boolean>;

  // CRUD Operations

  /**
   * Select records from table
   * @param table Table name
   * @param options Query options (filters, ordering, pagination)
   */
  select<T = any>(table: string, options?: QueryOptions): Promise<T[]>;

  /**
   * Select single record by ID
   * @param table Table name
   * @param id Record ID
   */
  selectById<T = any>(table: string, id: string): Promise<T | null>;

  /**
   * Insert new record
   * @param table Table name
   * @param data Record data
   */
  insert<T = any>(table: string, data: Partial<T>): Promise<InsertResult<T>>;

  /**
   * Insert multiple records
   * @param table Table name
   * @param data Array of records
   */
  insertMany<T = any>(table: string, data: Partial<T>[]): Promise<InsertResult<T>[]>;

  /**
   * Update record(s)
   * @param table Table name
   * @param id Record ID or filter options
   * @param data Updated data
   */
  update<T = any>(
    table: string,
    id: string | QueryOptions,
    data: Partial<T>
  ): Promise<UpdateResult<T>>;

  /**
   * Delete record(s)
   * @param table Table name
   * @param id Record ID or filter options
   */
  delete(table: string, id: string | QueryOptions): Promise<DeleteResult>;

  /**
   * Execute raw SQL query (escape hatch for complex queries)
   * @param query SQL query string
   * @param params Query parameters (prevents SQL injection)
   */
  rawQuery<T = any>(query: string, params?: any[]): Promise<T[]>;

  // Real-time subscriptions (Supabase-specific, optional for other adapters)

  /**
   * Subscribe to table changes
   * @param table Table name
   * @param callback Function called on insert/update/delete
   * @returns Unsubscribe function
   */
  subscribe<T = any>(
    table: string,
    callback: (event: {
      type: 'INSERT' | 'UPDATE' | 'DELETE';
      old: T | null;
      new: T | null;
    }) => void
  ): () => void;

  // Transactions

  /**
   * Execute operations in a transaction
   * @param operations Array of database operations
   */
  transaction<T = any>(
    operations: Array<() => Promise<any>>
  ): Promise<T[]>;
}

/**
 * Custom error types for database operations
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code:
      | 'CONNECTION_FAILED'   // Failed to connect to database
      | 'QUERY_FAILED'        // Query execution failed
      | 'NOT_FOUND'           // Record not found
      | 'DUPLICATE_KEY'       // Unique constraint violation
      | 'FOREIGN_KEY'         // Foreign key constraint violation
      | 'PERMISSION_DENIED'   // RLS policy violation
      | 'TIMEOUT'             // Query timeout
      | 'INVALID_QUERY'       // Malformed query
      | 'UNKNOWN_ERROR',      // Unexpected error
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
