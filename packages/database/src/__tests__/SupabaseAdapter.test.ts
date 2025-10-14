import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAdapter } from '../adapters/SupabaseAdapter';
import type { SupabaseConfig } from '../adapters/SupabaseAdapter';
import type { DatabasePort } from '@ybis/core';
import { DatabaseError } from '@ybis/core';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  channel: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn(),
  removeChannel: vi.fn(),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('SupabaseAdapter', () => {
  let dbAdapter: DatabasePort;
  const config: SupabaseConfig = {
    url: 'http://fake.supabase.co',
    anonKey: 'fake-key',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Mock a successful health check during initialization
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.select.mockReturnValue({
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    });
    dbAdapter = new SupabaseAdapter(config);
    await dbAdapter.initialize();
  });

  it('should initialize the Supabase client on construction', () => {
    expect(createClient).toHaveBeenCalledWith(config.url, config.anonKey, expect.any(Object));
  });

  describe('selectById', () => {
    it('should return an item if found', async () => {
      const user = { id: '1', name: 'Test User' };
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: user, error: null }),
      }));

      const result = await dbAdapter.selectById('users', '1');

      expect(result).toEqual(user);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    });

    it('should return null if not found (PGRST116 error)', async () => {
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'not found' } }),
      }));

      const result = await dbAdapter.selectById('users', 'not-found');

      expect(result).toBeNull();
    });

    it('should throw a DatabaseError on other query failures', async () => {
      const supabaseError = { message: 'Query failed', code: 'XXYYZ' };
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: supabaseError }),
      }));

      await expect(dbAdapter.selectById('users', '1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('insert', () => {
    it('should create and return the new item with id', async () => {
      const newUser = { name: 'New User' };
      const createdUser = { id: '2', name: 'New User' };
      mockSupabaseClient.insert.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createdUser, error: null }),
      }));

      const result = await dbAdapter.insert('users', newUser);

      expect(result.data).toEqual(createdUser);
      expect(result.id).toBe('2');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('should update and return the updated item', async () => {
      const updates = { name: 'Updated Name' };
      const updatedUser = { id: '1', name: 'Updated Name' };
      mockSupabaseClient.update.mockImplementationOnce(() => ({
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: [updatedUser], error: null, count: 1 }),
      }));

      const result = await dbAdapter.update('users', '1', updates);

      expect(result.data).toEqual(updatedUser);
      expect(result.count).toBe(1);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(updates);
    });
  });

  describe('delete', () => {
    it('should resolve successfully and return count on deletion', async () => {
      mockSupabaseClient.delete.mockImplementationOnce(() => ({
        eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
      }));

      const result = await dbAdapter.delete('users', '1');

      expect(result.count).toBe(1);
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should create a subscription and return an unsubscribe function', () => {
      const callback = vi.fn();

      // Mock channel subscription
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const unsubscribe = dbAdapter.subscribe('messages', callback);

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('messages_changes');
      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        expect.any(Function)
      );
      expect(mockChannel.subscribe).toHaveBeenCalled();

      // Test unsubscribe
      unsubscribe();
      expect(mockSupabaseClient.removeChannel).toHaveBeenCalledWith(mockChannel);
    });
  });
});
