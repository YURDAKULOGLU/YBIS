/**
 * @ybis/storage - File storage abstraction package
 *
 * Exports:
 * - StoragePort: Abstract interface for file storage operations
 * - SupabaseStorageAdapter: Supabase Storage implementation (Closed Beta)
 * - StorageError: Standard error type
 * - Types: FileMetadata, UploadOptions, DownloadOptions, etc.
 */

// Re-export port interface from @ybis/core
export type {
  StoragePort,
  FileMetadata,
  UploadOptions,
  UploadResult,
  DownloadOptions,
  ListOptions,
  SignedUrlOptions,
} from '@ybis/core';

export { StorageError } from '@ybis/core';

// Adapters
export { SupabaseStorageAdapter } from './adapters/SupabaseStorageAdapter';
export type { SupabaseStorageConfig } from './adapters/SupabaseStorageAdapter';
