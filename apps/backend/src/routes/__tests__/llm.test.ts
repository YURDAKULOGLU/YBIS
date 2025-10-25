/**
 * LLM Routes Tests
 *
 * Tests for /api/llm/* endpoints
 * Coverage: POST /generate, POST /chat, POST /embed
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import type { LLMPort, GenerationResult, Message } from '@ybis/llm';
import { LLMError } from '@ybis/llm';
import llmRoutes from '../llm';

// Mock LLMPort
const createMockLLMPort = (): LLMPort => ({
  generate: vi.fn(),
  chat: vi.fn(),
  embed: vi.fn(),
  stream: vi.fn(),
  countTokens: vi.fn(),
  initialize: vi.fn(),
  healthCheck: vi.fn(),
});

describe('LLM Routes', () => {
  let app: Hono;
  let mockLLMPort: LLMPort;

  beforeEach(() => {
    // Create fresh app and mock for each test
    app = new Hono();
    mockLLMPort = createMockLLMPort();

    // Inject mock LLM port into context
    app.use('*', async (c, next) => {
      c.set('llm', mockLLMPort);
      await next();
    });

    // Mount LLM routes
    app.route('/llm', llmRoutes);
  });

  describe('POST /llm/generate', () => {
    it('should generate text with valid prompt', async () => {
      // Arrange
      const mockResponse: GenerationResult = {
        content: 'Generated text response',
        model: 'gpt-4o-mini',
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        finishReason: 'stop',
      };
      vi.mocked(mockLLMPort.generate).mockResolvedValue(mockResponse);

      // Act
      const response = await app.request('/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Write a haiku about coding',
          temperature: 0.7,
          maxTokens: 100,
        }),
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        content: 'Generated text response',
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        model: 'gpt-4o-mini',
        finishReason: 'stop',
      });
      expect(mockLLMPort.generate).toHaveBeenCalledWith('Write a haiku about coding', {
        temperature: 0.7,
        maxTokens: 100,
      });
    });

    it('should return 400 when prompt is missing', async () => {
      // Act
      const response = await app.request('/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 0.7,
        }),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Prompt is required' });
      expect(mockLLMPort.generate).not.toHaveBeenCalled();
    });

    it('should return 400 when prompt is not a string', async () => {
      // Act
      const response = await app.request('/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 123, // Invalid: number instead of string
        }),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Prompt is required' });
      expect(mockLLMPort.generate).not.toHaveBeenCalled();
    });

    it('should return 500 on LLMError', async () => {
      // Arrange
      const llmError = new LLMError('API rate limit exceeded', 'RATE_LIMIT');
      vi.mocked(mockLLMPort.generate).mockRejectedValue(llmError);

      // Act
      const response = await app.request('/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Test prompt' }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        error: 'API rate limit exceeded',
        code: 'RATE_LIMIT',
      });
    });

    it('should return 500 on unknown error', async () => {
      // Arrange
      vi.mocked(mockLLMPort.generate).mockRejectedValue(new Error('Network failure'));

      // Act
      const response = await app.request('/llm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Test prompt' }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Network failure' });
    });
  });

  describe('POST /llm/chat', () => {
    it('should chat with valid messages', async () => {
      // Arrange
      const messages: Message[] = [
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'Tell me a joke' },
      ];
      const mockResponse: GenerationResult = {
        content: 'Why did the programmer quit? No Arrays!',
        model: 'gpt-4o-mini',
        usage: { promptTokens: 25, completionTokens: 15, totalTokens: 40 },
        finishReason: 'stop',
      };
      vi.mocked(mockLLMPort.chat).mockResolvedValue(mockResponse);

      // Act
      const response = await app.request('/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          temperature: 0.8,
          maxTokens: 200,
        }),
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        content: 'Why did the programmer quit? No Arrays!',
        usage: { promptTokens: 25, completionTokens: 15, totalTokens: 40 },
        model: 'gpt-4o-mini',
        finishReason: 'stop',
      });
      expect(mockLLMPort.chat).toHaveBeenCalledWith(messages, {
        temperature: 0.8,
        maxTokens: 200,
      });
    });

    it('should return 400 when messages are missing', async () => {
      // Act
      const response = await app.request('/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 0.7,
        }),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Messages array is required' });
      expect(mockLLMPort.chat).not.toHaveBeenCalled();
    });

    it('should return 400 when messages is not an array', async () => {
      // Act
      const response = await app.request('/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: 'invalid', // Invalid: string instead of array
        }),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Messages array is required' });
      expect(mockLLMPort.chat).not.toHaveBeenCalled();
    });

    it('should return 500 on LLMError', async () => {
      // Arrange
      const llmError = new LLMError('Invalid API key', 'INVALID_API_KEY');
      vi.mocked(mockLLMPort.chat).mockRejectedValue(llmError);

      // Act
      const response = await app.request('/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Invalid API key',
        code: 'INVALID_API_KEY',
      });
    });

    it('should return 500 on unknown error', async () => {
      // Arrange
      vi.mocked(mockLLMPort.chat).mockRejectedValue(new Error('Timeout'));

      // Act
      const response = await app.request('/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Timeout' });
    });
  });

  describe('POST /llm/embed', () => {
    it('should create embedding with valid text', async () => {
      // Arrange
      const mockEmbedding = new Array(1536).fill(0).map(() => Math.random());
      vi.mocked(mockLLMPort.embed).mockResolvedValue(mockEmbedding);

      // Act
      const response = await app.request('/llm/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'This is a sample text to embed',
        }),
      });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.embedding).toEqual(mockEmbedding);
      expect(data.dimensions).toBe(1536);
      expect(mockLLMPort.embed).toHaveBeenCalledWith('This is a sample text to embed');
    });

    it('should return 400 when text is missing', async () => {
      // Act
      const response = await app.request('/llm/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Text is required' });
      expect(mockLLMPort.embed).not.toHaveBeenCalled();
    });

    it('should return 400 when text is not a string', async () => {
      // Act
      const response = await app.request('/llm/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ['invalid'], // Invalid: array instead of string
        }),
      });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Text is required' });
      expect(mockLLMPort.embed).not.toHaveBeenCalled();
    });

    it('should return 500 on LLMError', async () => {
      // Arrange
      const llmError = new LLMError('Model not found', 'MODEL_NOT_FOUND');
      vi.mocked(mockLLMPort.embed).mockRejectedValue(llmError);

      // Act
      const response = await app.request('/llm/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Sample text' }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Model not found',
        code: 'MODEL_NOT_FOUND',
      });
    });

    it('should return 500 on unknown error', async () => {
      // Arrange
      vi.mocked(mockLLMPort.embed).mockRejectedValue(new Error('Service unavailable'));

      // Act
      const response = await app.request('/llm/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Sample text' }),
      });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Service unavailable' });
    });
  });
});
