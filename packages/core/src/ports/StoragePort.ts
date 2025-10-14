/**
 * StoragePort - File storage abstraction interface
 *
 * Closed Beta: Supabase Storage
 * MVP: Google Cloud Storage
 *
 * This port allows swapping storage providers without changing app code.
 */

/**
 * File metadata
 */
export interface FileMetadata {
  /**
   * File name
   */
  name: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * MIME type
   */
  mimeType: string;

  /**
   * Last modified timestamp
   */
  lastModified: Date;

  /**
   * File path in bucket
   */
  path: string;

  /**
   * Public URL (if file is public)
   */
  publicUrl?: string;

  /**
   * Custom metadata (key-value pairs)
   */
  metadata?: Record<string, string>;
}

/**
 * Upload options
 */
export interface UploadOptions {
  /**
   * Content type (MIME type)
   * Auto-detected if not provided
   */
  contentType?: string;

  /**
   * Cache control header
   * Example: "public, max-age=31536000"
   */
  cacheControl?: string;

  /**
   * Make file publicly accessible
   * Default: false
   */
  public?: boolean;

  /**
   * Upsert (overwrite if exists)
   * Default: false
   */
  upsert?: boolean;

  /**
   * Custom metadata
   */
  metadata?: Record<string, string>;

  /**
   * Upload progress callback
   * @param progress Progress percentage (0-100)
   */
  onProgress?: (progress: number) => void;
}

/**
 * Download options
 */
export interface DownloadOptions {
  /**
   * Transform image (resize, crop, etc.)
   * Only works for image files
   */
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
  };
}

/**
 * List options
 */
export interface ListOptions {
  /**
   * Limit number of results
   */
  limit?: number;

  /**
   * Offset for pagination
   */
  offset?: number;

  /**
   * Sort by column
   */
  sortBy?: 'name' | 'updated_at' | 'created_at';

  /**
   * Search query
   */
  search?: string;
}

/**
 * Upload result
 */
export interface UploadResult {
  /**
   * File path in bucket
   */
  path: string;

  /**
   * Public URL (if file is public)
   */
  publicUrl?: string;

  /**
   * File metadata
   */
  metadata: FileMetadata;
}

/**
 * Signed URL options
 */
export interface SignedUrlOptions {
  /**
   * Expiration time in seconds
   * Default: 3600 (1 hour)
   */
  expiresIn?: number;

  /**
   * Transform options (for images)
   */
  transform?: DownloadOptions['transform'];
}

/**
 * StoragePort - Abstract interface for file storage operations
 *
 * Implementations:
 * - SupabaseStorageAdapter (Closed Beta)
 * - GCSAdapter (MVP) - Google Cloud Storage
 * - MockStorageAdapter (Testing)
 */
export interface StoragePort {
  /**
   * Initialize storage connection
   */
  initialize(): Promise<void>;

  /**
   * Check connection health
   */
  healthCheck(): Promise<boolean>;

  /**
   * Upload file to bucket
   * @param bucket Bucket name
   * @param path File path in bucket
   * @param file File data (Buffer, Blob, ArrayBuffer, or File)
   * @param options Upload options
   */
  upload(
    bucket: string,
    path: string,
    file: Buffer | Blob | ArrayBuffer | File,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Download file from bucket
   * @param bucket Bucket name
   * @param path File path in bucket
   * @param options Download options
   */
  download(
    bucket: string,
    path: string,
    options?: DownloadOptions
  ): Promise<Blob>;

  /**
   * Delete file from bucket
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  delete(bucket: string, path: string): Promise<void>;

  /**
   * Delete multiple files from bucket
   * @param bucket Bucket name
   * @param paths Array of file paths
   */
  deleteMany(bucket: string, paths: string[]): Promise<void>;

  /**
   * Get file metadata
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  getMetadata(bucket: string, path: string): Promise<FileMetadata>;

  /**
   * List files in bucket
   * @param bucket Bucket name
   * @param path Directory path (optional)
   * @param options List options
   */
  list(
    bucket: string,
    path?: string,
    options?: ListOptions
  ): Promise<FileMetadata[]>;

  /**
   * Get public URL for file
   * @param bucket Bucket name
   * @param path File path in bucket
   */
  getPublicUrl(bucket: string, path: string): string;

  /**
   * Create signed URL (temporary access)
   * @param bucket Bucket name
   * @param path File path in bucket
   * @param options Signed URL options
   */
  createSignedUrl(
    bucket: string,
    path: string,
    options?: SignedUrlOptions
  ): Promise<string>;

  /**
   * Move file to new location
   * @param bucket Bucket name
   * @param fromPath Source path
   * @param toPath Destination path
   */
  move(bucket: string, fromPath: string, toPath: string): Promise<void>;

  /**
   * Copy file to new location
   * @param bucket Bucket name
   * @param fromPath Source path
   * @param toPath Destination path
   */
  copy(bucket: string, fromPath: string, toPath: string): Promise<void>;

  /**
   * Create a new bucket
   * @param bucket Bucket name
   * @param options Bucket options
   */
  createBucket(
    bucket: string,
    options?: { public?: boolean }
  ): Promise<void>;

  /**
   * Delete a bucket
   * @param bucket Bucket name
   */
  deleteBucket(bucket: string): Promise<void>;

  /**
   * List all buckets
   */
  listBuckets(): Promise<string[]>;
}

/**
 * Custom error types for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code:
      | 'NOT_INITIALIZED'      // Storage not initialized
      | 'CONNECTION_FAILED'    // Failed to connect
      | 'UPLOAD_FAILED'        // Upload failed
      | 'DOWNLOAD_FAILED'      // Download failed
      | 'DELETE_FAILED'        // Delete failed
      | 'NOT_FOUND'            // File/bucket not found
      | 'ALREADY_EXISTS'       // File/bucket already exists
      | 'PERMISSION_DENIED'    // Access denied
      | 'INVALID_FILE'         // Invalid file format
      | 'FILE_TOO_LARGE'       // File exceeds size limit
      | 'BUCKET_NOT_FOUND'     // Bucket not found
      | 'INVALID_PATH'         // Invalid file path
      | 'UNKNOWN_ERROR',       // Unexpected error
    public originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}
