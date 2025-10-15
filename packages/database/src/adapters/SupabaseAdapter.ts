/**
 * SupabaseAdapter - Supabase implementation of DatabasePort
 *
 * Implements DatabasePort using Supabase PostgreSQL client.
 * Handles RLS (Row Level Security) policies and real-time subscriptions.
 *
 * @see DatabasePort for interface documentation
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type {
  DatabasePort,
  QueryOptions,
  InsertResult,
  UpdateResult,
  DeleteResult,
} from '@ybis/core';
import { DatabaseError } from '@ybis/core';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string; // For server-side operations bypassing RLS
}

export class SupabaseAdapter implements DatabasePort {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig;
  private subscriptions = new Map<string, RealtimeChannel>();

  constructor(config: SupabaseConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Use service role key if available (server-side), otherwise anon key (client-side)
      const key = this.config.serviceRoleKey ?? this.config.anonKey;

      this.client = createClient(this.config.url, key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10, // Rate limiting for real-time events
          },
        },
      });

      // Test connection
      const healthy = await this.healthCheck();
      if (!healthy) {
        throw new Error('Failed to connect to Supabase');
      }
    } catch (error) {
      throw new DatabaseError(
        'Failed to initialize database connection',
        'CONNECTION_FAILED',
        error as Error
      );
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      // Unsubscribe from all channels
      this.subscriptions.forEach((channel) => {
        void this.client?.removeChannel(channel);
      });
      this.subscriptions.clear();

      // Note: Supabase client doesn't have explicit close method
      // Connection will be closed when client is garbage collected
      this.client = null;
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;

    try {
      // Try a simple query to test connection
      const { error } = await this.client.from('_health_check_table').select('*').limit(1);

      // Table might not exist, but if we get a connection error, it's unhealthy
      if (error?.message?.includes('connection')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // CRUD Operations

  async select<T = unknown>(table: string, options?: QueryOptions): Promise<T[]> {
    this.ensureInitialized();

    try {
      let query = this.client!.from(table).select('*');

      // Apply filters
      if (options?.filters) {
        for (const filter of options.filters) {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.column, filter.value);
              break;
            case 'neq':
              query = query.neq(filter.column, filter.value);
              break;
            case 'gt':
              query = query.gt(filter.column, filter.value);
              break;
            case 'gte':
              query = query.gte(filter.column, filter.value);
              break;
            case 'lt':
              query = query.lt(filter.column, filter.value);
              break;
            case 'lte':
              query = query.lte(filter.column, filter.value);
              break;
            case 'like':
              query = query.like(filter.column, filter.value as string);
              break;
            case 'in':
              query = query.in(filter.column, filter.value as readonly unknown[]);
              break;
          }
        }
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return (data as T[]) || [];
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to select from ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async selectById<T = unknown>(table: string, id: string): Promise<T | null> {
    this.ensureInitialized();

    try {
      const { data, error } = await this.client!
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw this.handleSupabaseError(error);
      }

      return data as T;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to select by ID from ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async insert<T = unknown>(table: string, data: Partial<T>): Promise<InsertResult<T>> {
    this.ensureInitialized();

    try {
      const { data: result, error } = await this.client!
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return {
        data: result as T,
        id: result.id,
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to insert into ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async insertMany<T = unknown>(table: string, data: Partial<T>[]): Promise<InsertResult<T>[]> {
    this.ensureInitialized();

    try {
      const { data: results, error } = await this.client!
        .from(table)
        .insert(data)
        .select();

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return (results ?? []).map((row: Record<string, unknown>) => ({
        data: row as T,
        id: row['id'] as string,
      }));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to insert many into ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async update<T = unknown>(
    table: string,
    id: string | QueryOptions,
    data: Partial<T>
  ): Promise<UpdateResult<T>> {
    this.ensureInitialized();

    try {
      let query = this.client!.from(table).update(data);

      // Apply filter based on ID or QueryOptions
      if (typeof id === 'string') {
        query = query.eq('id', id);
      } else {
        // Apply filters from QueryOptions
        if (id.filters) {
          for (const filter of id.filters) {
            query = query.eq(filter.column, filter.value);
          }
        }
      }

      const { data: results, error, count } = await query.select();

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return {
        data: results?.[0] as T,
        count: count ?? results?.length ?? 0,
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to update ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async delete(table: string, id: string | QueryOptions): Promise<DeleteResult> {
    this.ensureInitialized();

    try {
      let query = this.client!.from(table).delete();

      // Apply filter based on ID or QueryOptions
      if (typeof id === 'string') {
        query = query.eq('id', id);
      } else {
        // Apply filters from QueryOptions
        if (id.filters) {
          for (const filter of id.filters) {
            query = query.eq(filter.column, filter.value);
          }
        }
      }

      const { error, count } = await query;

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return {
        count: count ?? 0,
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to delete from ${table}`,
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  async rawQuery<T = unknown>(_query: string, _params?: unknown[]): Promise<T[]> {
    this.ensureInitialized();

    try {
      // Supabase doesn't expose raw SQL directly via client library
      // For raw queries, use Supabase Edge Functions or RPC (stored procedures)
      // This is a limitation we document for users

      throw new DatabaseError(
        'Raw SQL queries are not supported in Supabase client. Use RPC functions instead.',
        'INVALID_QUERY'
      );
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        'Failed to execute raw query',
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  // Real-time subscriptions

  subscribe<T = unknown>(
    table: string,
    callback: (event: {
      type: 'INSERT' | 'UPDATE' | 'DELETE';
      old: T | null;
      new: T | null;
    }) => void
  ): () => void {
    this.ensureInitialized();

    const channel = this.client!
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          callback({
            type: payload.eventType,
            old: payload.old as T | null,
            new: payload.new as T | null,
          });
        }
      )
      .subscribe();

    this.subscriptions.set(table, channel);

    // Return unsubscribe function
    return () => {
      if (this.client && this.subscriptions.has(table)) {
        const ch = this.subscriptions.get(table);
        if (ch) {
          void this.client.removeChannel(ch);
          this.subscriptions.delete(table);
        }
      }
    };
  }

  // Transactions

  async transaction<T = unknown>(operations: Array<() => Promise<unknown>>): Promise<T[]> {
    this.ensureInitialized();

    // Note: Supabase JS client doesn't support native transactions
    // Transactions must be implemented via Postgres functions (RPC)
    // For now, we execute operations sequentially (not atomic!)

    try {
      const results: T[] = [];

      for (const operation of operations) {
        const result = await operation();
        results.push(result as T);
      }

      return results;
    } catch (error) {
      throw new DatabaseError(
        'Transaction failed. Note: Supabase client transactions are NOT atomic. Use RPC for true ACID transactions.',
        'QUERY_FAILED',
        error as Error
      );
    }
  }

  // Private helpers

  private ensureInitialized(): void {
    if (!this.client) {
      throw new DatabaseError(
        'Database not initialized. Call initialize() first.',
        'CONNECTION_FAILED'
      );
    }
  }

  private handleSupabaseError(error: unknown): DatabaseError {
    // Map Supabase error codes to our DatabaseError codes
    const err = error as { code?: string; message?: string };
    const message = err.message ?? 'Unknown database error';

    if (err.code === 'PGRST116') {
      return new DatabaseError(message, 'NOT_FOUND', error as Error);
    }

    if (err.code === '23505') {
      return new DatabaseError(message, 'DUPLICATE_KEY', error as Error);
    }

    if (err.code === '23503') {
      return new DatabaseError(message, 'FOREIGN_KEY', error as Error);
    }

    if (err.message?.includes('JWT') || err.message?.includes('permission')) {
      return new DatabaseError(message, 'PERMISSION_DENIED', error as Error);
    }

    if (err.message?.includes('timeout')) {
      return new DatabaseError(message, 'TIMEOUT', error as Error);
    }

    return new DatabaseError(message, 'UNKNOWN_ERROR', error as Error);
  }
}
