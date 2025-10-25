/**
 * PortRegistry - Central registry for all port adapters
 *
 * Manages initialization and access to all Tier 1 port adapters:
 * - DatabasePort → SupabaseAdapter
 * - LLMPort → OpenAIAdapter
 * - StoragePort → SupabaseStorageAdapter
 *
 * This follows the "zero vendor lock-in" principle by keeping
 * adapter selection configurable via environment variables.
 */

import type { DatabasePort } from '@ybis/database';
import { SupabaseAdapter as DatabaseAdapter } from '@ybis/database';
import type { LLMPort } from '@ybis/llm';
import { OpenAIAdapter } from '@ybis/llm';
import type { StoragePort } from '@ybis/storage';
import { SupabaseStorageAdapter } from '@ybis/storage';
import Logger from '@ybis/logging';

export interface PortRegistryConfig {
  // Supabase (Database + Storage)
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;

  // OpenAI (LLM)
  openaiApiKey: string;
  openaiModel?: string;
}

/**
 * Singleton registry for all ports
 */
export class PortRegistry {
  private static instance: PortRegistry | null = null;

  private _database: DatabasePort | null = null;
  private _llm: LLMPort | null = null;
  private _storage: StoragePort | null = null;

  private config: PortRegistryConfig;
  private initialized = false;

  private constructor(config: PortRegistryConfig) {
    this.config = config;
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: PortRegistryConfig): PortRegistry {
    if (!PortRegistry.instance) {
      if (!config) {
        throw new Error('PortRegistry: config required for first initialization');
      }
      PortRegistry.instance = new PortRegistry(config);
    }
    return PortRegistry.instance;
  }

  /**
   * Initialize all ports
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      Logger.info('PortRegistry already initialized', { type: 'LIFECYCLE' });
      return;
    }

    Logger.info('Initializing all ports...', { type: 'LIFECYCLE' });

    try {
      // Initialize Database Port (Supabase)
      this._database = new DatabaseAdapter({
        url: this.config.supabaseUrl,
        anonKey: this.config.supabaseAnonKey,
        serviceRoleKey: this.config.supabaseServiceKey,
      });
      await this._database.initialize();
      Logger.info('DatabasePort initialized (SupabaseAdapter)', { type: 'LIFECYCLE' });

      // Initialize LLM Port (OpenAI)
      this._llm = new OpenAIAdapter({
        defaultModel: this.config.openaiModel ?? 'gpt-4o-mini',
      });
      await this._llm.initialize(this.config.openaiApiKey);
      Logger.info('LLMPort initialized (OpenAIAdapter)', { type: 'LIFECYCLE' });

      // Initialize Storage Port (Supabase Storage)
      this._storage = new SupabaseStorageAdapter({
        url: this.config.supabaseUrl,
        anonKey: this.config.supabaseAnonKey,
        serviceRoleKey: this.config.supabaseServiceKey,
      });
      await this._storage.initialize();
      Logger.info('StoragePort initialized (SupabaseStorageAdapter)', { type: 'LIFECYCLE' });

      this.initialized = true;
      Logger.info('All ports initialized successfully', { type: 'LIFECYCLE' });
    } catch (error) {
      Logger.error('Failed to initialize ports', error as Error, { type: 'LIFECYCLE' });
      throw error;
    }
  }

  /**
   * Health check for all ports
   */
  async healthCheck(): Promise<{
    database: boolean;
    llm: boolean;
    storage: boolean;
    overall: boolean;
  }> {
    const database = this._database ? await this._database.healthCheck() : false;
    const llm = this._llm ? await this._llm.healthCheck() : false;
    const storage = this._storage ? await this._storage.healthCheck() : false;

    return {
      database,
      llm,
      storage,
      overall: database && llm && storage,
    };
  }

  /**
   * Get Database Port
   */
  get database(): DatabasePort {
    if (!this._database) {
      throw new Error('DatabasePort not initialized. Call initialize() first.');
    }
    return this._database;
  }

  /**
   * Get LLM Port
   */
  get llm(): LLMPort {
    if (!this._llm) {
      throw new Error('LLMPort not initialized. Call initialize() first.');
    }
    return this._llm;
  }

  /**
   * Get Storage Port
   */
  get storage(): StoragePort {
    if (!this._storage) {
      throw new Error('StoragePort not initialized. Call initialize() first.');
    }
    return this._storage;
  }

  /**
   * Check if all ports are initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset singleton (for testing)
   */
  static reset(): void {
    PortRegistry.instance = null;
  }
}
