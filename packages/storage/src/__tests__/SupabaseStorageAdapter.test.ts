import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseStorageAdapter } from '../adapters/SupabaseStorageAdapter';
import type { StoragePort } from '@ybis/core';
import { StorageError } from '@ybis/core';

// Mock Supabase storage operations
const mockUpload = vi.fn();
const mockDownload = vi.fn();
const mockRemove = vi.fn();
const mockList = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockCreateSignedUrl = vi.fn();
const mockMove = vi.fn();
const mockCopy = vi.fn();
const mockListBuckets = vi.fn();
const mockCreateBucket = vi.fn();
const mockDeleteBucket = vi.fn();

const mockStorageBucket = {
  upload: mockUpload,
  download: mockDownload,
  remove: mockRemove,
  list: mockList,
  getPublicUrl: mockGetPublicUrl,
  createSignedUrl: mockCreateSignedUrl,
  move: mockMove,
  copy: mockCopy,
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => mockStorageBucket),
      listBuckets: mockListBuckets,
      createBucket: mockCreateBucket,
      deleteBucket: mockDeleteBucket,
    },
  })),
}));

describe('SupabaseStorageAdapter', () => {
  let storageAdapter: StoragePort;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock successful health check
    mockListBuckets.mockResolvedValue({ data: [], error: null });

    storageAdapter = new SupabaseStorageAdapter({
      url: 'https://fake.supabase.co',
      anonKey: 'fake-key',
    });
    await storageAdapter.initialize();
  });

  describe('upload', () => {
    it('should upload file and return metadata', async () => {
      const buffer = Buffer.from('test content');
      const uploadPath = 'test-folder/file.txt';

      mockUpload.mockResolvedValue({
        data: { path: uploadPath },
        error: null,
      });

      mockList.mockResolvedValue({
        data: [
          {
            name: 'file.txt',
            metadata: { size: 12, mimetype: 'text/plain' },
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
        ],
        error: null,
      });

      const result = await storageAdapter.upload('my-bucket', uploadPath, buffer, {
        contentType: 'text/plain',
      });

      expect(mockUpload).toHaveBeenCalledWith(
        uploadPath,
        buffer,
        expect.objectContaining({ contentType: 'text/plain' })
      );
      expect(result.path).toBe(uploadPath);
    });

    it('should throw StorageError if upload fails', async () => {
      mockUpload.mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      });

      await expect(
        storageAdapter.upload('bucket', 'path', Buffer.from('test'))
      ).rejects.toThrow(StorageError);
    });
  });

  describe('download', () => {
    it('should download file as Blob', async () => {
      const mockBlob = new Blob(['content'], { type: 'text/plain' });
      mockDownload.mockResolvedValue({
        data: mockBlob,
        error: null,
      });

      const result = await storageAdapter.download('bucket', 'file.txt');

      expect(mockDownload).toHaveBeenCalledWith('file.txt');
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('delete', () => {
    it('should delete file successfully', async () => {
      mockRemove.mockResolvedValue({ error: null });

      await storageAdapter.delete('bucket', 'file.txt');

      expect(mockRemove).toHaveBeenCalledWith(['file.txt']);
    });
  });

  describe('getPublicUrl', () => {
    it('should return public URL', () => {
      const publicUrl = 'https://fake.supabase.co/storage/v1/bucket/file.txt';
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl } });

      const result = storageAdapter.getPublicUrl('bucket', 'file.txt');

      expect(result).toBe(publicUrl);
    });
  });

  describe('createSignedUrl', () => {
    it('should create signed URL with expiry', async () => {
      const signedUrl = 'https://fake.supabase.co/storage/v1/signed/abc123';
      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl },
        error: null,
      });

      const result = await storageAdapter.createSignedUrl('bucket', 'file.txt', {
        expiresIn: 3600,
      });

      expect(mockCreateSignedUrl).toHaveBeenCalledWith('file.txt', 3600, expect.any(Object));
      expect(result).toBe(signedUrl);
    });
  });

  describe('list', () => {
    it('should list files in bucket', async () => {
      mockList.mockResolvedValue({
        data: [
          {
            name: 'file1.txt',
            metadata: { size: 100, mimetype: 'text/plain' },
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
        ],
        error: null,
      });

      const result = await storageAdapter.list('bucket', 'folder/');

      expect(mockList).toHaveBeenCalledWith('folder/', expect.any(Object));
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('file1.txt');
    });
  });
});
