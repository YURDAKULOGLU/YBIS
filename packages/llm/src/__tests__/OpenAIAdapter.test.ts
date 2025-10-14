import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIAdapter } from '../adapters/OpenAIAdapter';
import type { LLMPort } from '@ybis/core';
import { LLMError } from '@ybis/core';

// Mock the OpenAI library
const mockCreate = vi.fn();
const mockListModels = vi.fn();
const mockCreateEmbeddings = vi.fn();

vi.mock('openai', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
    models: {
      list: mockListModels,
    },
    embeddings: {
      create: mockCreateEmbeddings,
    },
  })),
}));

describe('OpenAIAdapter', () => {
  let llmAdapter: LLMPort;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock successful health check
    mockListModels.mockResolvedValue({ data: [] });

    llmAdapter = new OpenAIAdapter({ defaultModel: 'gpt-4o-mini' });
    await llmAdapter.initialize('fake-api-key');
  });

  describe('generate', () => {
    it('should call the OpenAI API and return the content', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'This is the generated text.',
            },
            finish_reason: 'stop',
          },
        ],
        model: 'gpt-4o-mini',
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await llmAdapter.generate('Tell me a story.');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Tell me a story.' }],
        })
      );
      expect(result.content).toBe('This is the generated text.');
      expect(result.usage.totalTokens).toBe(30);
    });

    it('should throw an LLMError if the API call fails', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      await expect(llmAdapter.generate('test')).rejects.toThrow(LLMError);
    });

    it('should throw if no choices returned', async () => {
      const mockResponse = { choices: [], usage: {} };
      mockCreate.mockResolvedValue(mockResponse);

      await expect(llmAdapter.generate('test')).rejects.toThrow(LLMError);
    });
  });

  describe('chat', () => {
    it('should handle multi-turn conversations', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Hello! How can I help?',
            },
            finish_reason: 'stop',
          },
        ],
        model: 'gpt-4o-mini',
        usage: {
          prompt_tokens: 15,
          completion_tokens: 8,
          total_tokens: 23,
        },
      };
      mockCreate.mockResolvedValue(mockResponse);

      const messages = [
        { role: 'user' as const, content: 'Hi' },
        { role: 'assistant' as const, content: 'Hello!' },
        { role: 'user' as const, content: 'How are you?' },
      ];

      const result = await llmAdapter.chat(messages);

      expect(result.content).toBe('Hello! How can I help?');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            { role: 'user', content: 'Hi' },
          ]),
        })
      );
    });
  });

  describe('embed', () => {
    it('should return embeddings vector', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4];
      mockCreateEmbeddings.mockResolvedValue({
        data: [{ embedding: mockEmbedding }],
      });

      const result = await llmAdapter.embed('test text');

      expect(result).toEqual(mockEmbedding);
      expect(mockCreateEmbeddings).toHaveBeenCalledWith({
        model: 'text-embedding-3-small',
        input: 'test text',
      });
    });
  });

  describe('countTokens', () => {
    it('should approximate token count', async () => {
      const text = 'This is a test string with approximately 8 tokens';
      const count = await llmAdapter.countTokens(text);

      expect(count).toBeGreaterThan(0);
      expect(typeof count).toBe('number');
    });
  });
});
