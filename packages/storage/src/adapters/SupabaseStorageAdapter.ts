/**
 * SupabaseStorageAdapter - Supabase Storage implementation of StoragePort
 *
 * Implements StoragePort using Supabase Storage client.
 * Supports public/private buckets, signed URLs, and image transformations.
 *
 * @see StoragePort for interface documentation
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  StoragePort,
  FileMetadata,
  UploadOptions,
  UploadResult,
  DownloadOptions,
  ListOptions,
  SignedUrlOptions,
} from '@ybis/core';
import { StorageError } from '@ybis/core';

export interface SupabaseStorageConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string; // For server-side operations
}

export class SupabaseStorageAdapter implements StoragePort {
  private client: SupabaseClient | null = null;
  private config: SupabaseStorageConfig;

  constructor(config: SupabaseStorageConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      const key = this.config.serviceRoleKey || this.config.anonKey;

      this.client = createClient(this.config.url, key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });

      const healthy = await this.healthCheck();
      if (!healthy) {
        throw new Error('Failed to connect to Supabase Storage');
      }
    } catch (error) {
      throw new StorageError(
        'Failed to initialize storage connection',
        'CONNECTION_FAILED',
        error as Error
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;

    try {
      // Try listing buckets as a health check
      const { error } = await this.client.storage.listBuckets();
      return !error;
    } catch {
      return false;
    }
  }

  async upload(
    bucket: string,
    path: string,
    file: Buffer | Blob | ArrayBuffer | File,
    options?: UploadOptions
  ): Promise<UploadResult> {
    this.ensureInitialized();

    try {
      const uploadOptions: any = {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl,
        upsert: options?.upsert ?? false,
      };

      // Handle progress callback (if supported by Supabase in future)
      // Currently Supabase doesn't support upload progress

      const { data, error } = await this.client!.storage
        .from(bucket)
        .upload(path, file, uploadOptions);

      if (error) {
        throw this.handleSupabaseError(error);
      }

      // Get metadata
      const metadata = await this.getMetadata(bucket, data.path);

      // Get public URL if requested
      const publicUrl = options?.public
        ? this.getPublicUrl(bucket, data.path)
        : undefined;

      return {
        path: data.path,
        publicUrl,
        metadata,
      };
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to upload file to ${bucket}/${path}`,
        'UPLOAD_FAILED',
        error as Error
      );
    }
  }

  async download(
    bucket: string,
    path: string,
    _options?: DownloadOptions
  ): Promise<Blob> {
    this.ensureInitialized();

    try {
      let downloadPath = path;

      // Apply transformations for images (if supported)
      // Supabase Storage supports image transformations via URL query params
      // But via download API, we get raw file

      const { data, error } = await this.client!.storage
        .from(bucket)
        .download(downloadPath);

      if (error) {
        throw this.handleSupabaseError(error);
      }

      if (!data) {
        throw new StorageError(`File not found: ${path}`, 'NOT_FOUND');
      }

      return data;
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to download file from ${bucket}/${path}`,
        'DOWNLOAD_FAILED',
        error as Error
      );
    }
  }

  async delete(bucket: string, path: string): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to delete file from ${bucket}/${path}`,
        'DELETE_FAILED',
        error as Error
      );
    }
  }

  async deleteMany(bucket: string, paths: string[]): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to delete ${paths.length} files from ${bucket}`,
        'DELETE_FAILED',
        error as Error
      );
    }
  }

  async getMetadata(bucket: string, path: string): Promise<FileMetadata> {
    this.ensureInitialized();

    try {
      // Supabase doesn't have a direct getMetadata API
      // We need to list files and find the matching one
      const { data, error } = await this.client!.storage
        .from(bucket)
        .list(this.getDirectory(path), {
          search: this.getFileName(path),
        });

      if (error) {
        throw this.handleSupabaseError(error);
      }

      const file = data?.find((f) => f.name === this.getFileName(path));
      if (!file) {
        throw new StorageError(`File not found: ${path}`, 'NOT_FOUND');
      }

      return {
        name: file.name,
        size: file.metadata?.['size'] || 0,
        mimeType: file.metadata?.['mimetype'] || 'application/octet-stream',
        lastModified: new Date(file.updated_at || file.created_at),
        path,
        metadata: file.metadata,
      };
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to get metadata for ${bucket}/${path}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  async list(
    bucket: string,
    path?: string,
    options?: ListOptions
  ): Promise<FileMetadata[]> {
    this.ensureInitialized();

    try {
      const { data, error } = await this.client!.storage
        .from(bucket)
        .list(path || '', {
          limit: options?.limit,
          offset: options?.offset,
          sortBy: options?.sortBy ? { column: options.sortBy, order: 'asc' } : undefined,
          search: options?.search,
        });

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return (data || []).map((file) => ({
        name: file.name,
        size: file.metadata?.['size'] || 0,
        mimeType: file.metadata?.['mimetype'] || 'application/octet-stream',
        lastModified: new Date(file.updated_at || file.created_at),
        path: path ? `${path}/${file.name}` : file.name,
        metadata: file.metadata,
      }));
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to list files in ${bucket}/${path || ''}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    this.ensureInitialized();

    const { data } = this.client!.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async createSignedUrl(
    bucket: string,
    path: string,
    options?: SignedUrlOptions
  ): Promise<string> {
    this.ensureInitialized();

    try {
      const expiresIn = options?.expiresIn || 3600; // 1 hour default

      // Build transform options
      const transform = options?.transform
        ? ({
            width: options.transform.width,
            height: options.transform.height,
            quality: options.transform.quality,
            format: options.transform.format,
          } as any)
        : undefined;

      const { data, error } = await this.client!.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn, { transform });

      if (error) {
        throw this.handleSupabaseError(error);
      }

      if (!data?.signedUrl) {
        throw new StorageError('Failed to create signed URL', 'UNKNOWN_ERROR');
      }

      return data.signedUrl;
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to create signed URL for ${bucket}/${path}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  async move(bucket: string, fromPath: string, toPath: string): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to move file from ${fromPath} to ${toPath}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  async copy(bucket: string, fromPath: string, toPath: string): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage
        .from(bucket)
        .copy(fromPath, toPath);

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to copy file from ${fromPath} to ${toPath}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  async createBucket(
    bucket: string,
    options?: { public?: boolean }
  ): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage.createBucket(bucket, {
        public: options?.public ?? false,
      });

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to create bucket: ${bucket}`,
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  async deleteBucket(bucket: string): Promise<void> {
    this.ensureInitialized();

    try {
      const { error } = await this.client!.storage.deleteBucket(bucket);

      if (error) {
        throw this.handleSupabaseError(error);
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        `Failed to delete bucket: ${bucket}`,
        'DELETE_FAILED',
        error as Error
      );
    }
  }

  async listBuckets(): Promise<string[]> {
    this.ensureInitialized();

    try {
      const { data, error } = await this.client!.storage.listBuckets();

      if (error) {
        throw this.handleSupabaseError(error);
      }

      return (data || []).map((bucket) => bucket.name);
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(
        'Failed to list buckets',
        'UNKNOWN_ERROR',
        error as Error
      );
    }
  }

  // Private helpers

  private ensureInitialized(): void {
    if (!this.client) {
      throw new StorageError(
        'Storage not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  private getDirectory(path: string): string {
    const parts = path.split('/');
    parts.pop(); // Remove filename
    return parts.join('/');
  }

  private getFileName(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1] || '';
  }

  private handleSupabaseError(error: any): StorageError {
    const message = error.message || 'Unknown storage error';

    if (error.statusCode === '404' || message.includes('not found')) {
      return new StorageError(message, 'NOT_FOUND', error);
    }

    if (error.statusCode === '409' || message.includes('already exists')) {
      return new StorageError(message, 'ALREADY_EXISTS', error);
    }

    if (error.statusCode === '403' || message.includes('permission')) {
      return new StorageError(message, 'PERMISSION_DENIED', error);
    }

    if (message.includes('too large') || message.includes('size')) {
      return new StorageError(message, 'FILE_TOO_LARGE', error);
    }

    if (message.includes('invalid') && message.includes('path')) {
      return new StorageError(message, 'INVALID_PATH', error);
    }

    return new StorageError(message, 'UNKNOWN_ERROR', error);
  }
}
