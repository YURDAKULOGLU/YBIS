/**
 * OpenAIAdapter - OpenAI implementation of LLMPort
 *
 * Implements LLMPort using OpenAI API (GPT-4o-mini for Closed Beta).
 * Supports chat completions, streaming, function calling, and embeddings.
 *
 * @see LLMPort for interface documentation
 */

import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/chat/completions';
import type {
  LLMPort,
  Message,
  GenerationOptions,
  GenerationResult,
  StreamChunk,
  FunctionDefinition,
} from '@ybis/core';
import { LLMError } from '@ybis/core';

export interface OpenAIConfig {
  /**
   * Default model to use
   * Closed Beta: gpt-4o-mini
   */
  defaultModel?: string;

  /**
   * Organization ID (optional)
   */
  organization?: string;

  /**
   * Base URL (for custom endpoints)
   */
  baseURL?: string;
}

export class OpenAIAdapter implements LLMPort {
  private client: OpenAI | null = null;
  private config: OpenAIConfig;
  private apiKey: string | null = null;

  constructor(config: OpenAIConfig = {}) {
    this.config = {
      defaultModel: 'gpt-4o-mini',
      ...config,
    };
  }

  async initialize(apiKey: string): Promise<void> {
    try {
      if (!apiKey || apiKey.trim() === '') {
        throw new LLMError('API key is required', 'INVALID_API_KEY');
      }

      this.apiKey = apiKey;
      this.client = new OpenAI({
        apiKey,
        organization: this.config.organization,
        baseURL: this.config.baseURL,
      });

      // Test connection with a minimal request
      const healthy = await this.healthCheck();
      if (!healthy) {
        throw new Error('Failed to connect to OpenAI');
      }
    } catch (error) {
      if (error instanceof LLMError) throw error;
      throw new LLMError(
        'Failed to initialize OpenAI client',
        'NOT_INITIALIZED',
        error as Error
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;

    try {
      // Try listing models as a health check
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult> {
    this.ensureInitialized();

    // Convert simple prompt to chat message
    const messages: Message[] = [{ role: 'user', content: prompt }];
    return this.chat(messages, options);
  }

  async chat(messages: Message[], options?: GenerationOptions): Promise<GenerationResult> {
    this.ensureInitialized();

    try {
      const params = this.buildChatParams(messages, options, false);

      const completion = await this.client!.chat.completions.create(
        params as ChatCompletionCreateParamsNonStreaming
      );

      const choice = completion.choices[0];
      if (!choice) {
        throw new LLMError('No completion choices returned', 'UNKNOWN_ERROR');
      }

      // Extract function call if present
      const functionCall = choice.message.function_call
        ? {
            name: choice.message.function_call.name,
            arguments: choice.message.function_call.arguments,
          }
        : undefined;

      return {
        content: choice.message.content ?? '',
        functionCall,
        usage: {
          promptTokens: completion.usage?.prompt_tokens ?? 0,
          completionTokens: completion.usage?.completion_tokens ?? 0,
          totalTokens: completion.usage?.total_tokens ?? 0,
        },
        finishReason: this.mapFinishReason(choice.finish_reason),
        model: completion.model,
      };
    } catch (error) {
      throw this.handleOpenAIError(error);
    }
  }

  async *stream(
    prompt: string | Message[],
    options?: GenerationOptions
  ): AsyncIterableIterator<StreamChunk> {
    this.ensureInitialized();

    try {
      const messages = typeof prompt === 'string' ? [{ role: 'user' as const, content: prompt }] : prompt;

      const params = this.buildChatParams(messages, { ...options, stream: true }, true);

      const stream = await this.client!.chat.completions.create(
        params as ChatCompletionCreateParamsStreaming
      );

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (!delta) continue;

        const functionCall = delta.function_call
          ? {
              name: delta.function_call.name,
              arguments: delta.function_call.arguments,
            }
          : undefined;

        yield {
          content: delta.content ?? '',
          done: chunk.choices[0]?.finish_reason !== null,
          functionCall,
        };
      }
    } catch (error) {
      throw this.handleOpenAIError(error);
    }
  }

  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();

    try {
      const response = await this.client!.embeddings.create({
        model: 'text-embedding-3-small', // Cheaper embedding model
        input: text,
      });

      const firstEmbedding = response.data[0];
      if (!firstEmbedding) {
        throw new LLMError('No embedding returned', 'UNKNOWN_ERROR');
      }
      return firstEmbedding.embedding;
    } catch (error) {
      throw this.handleOpenAIError(error);
    }
  }

  async countTokens(text: string): Promise<number> {
    // OpenAI doesn't provide a direct token counting API
    // Approximate: 1 token ≈ 4 characters for English
    // For production, use tiktoken library (not included to reduce dependencies)
    return Math.ceil(text.length / 4);
  }

  // Private helpers

  private ensureInitialized(): void {
    if (!this.client || !this.apiKey) {
      throw new LLMError(
        'OpenAI client not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  private buildChatParams(
    messages: Message[],
    options: GenerationOptions | undefined,
    stream: boolean
  ): ChatCompletionCreateParamsNonStreaming | ChatCompletionCreateParamsStreaming {
    const openaiMessages: ChatCompletionMessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const baseParams = {
      model: options?.model ?? this.config.defaultModel ?? 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
      top_p: options?.topP ?? 1.0,
      stop: options?.stopSequences,
      stream,
    };

    // Add function calling if provided
    if (options?.functions && options.functions.length > 0) {
      const functions = options.functions.map((fn: FunctionDefinition) => ({
        name: fn.name,
        description: fn.description,
        parameters: fn.parameters,
      }));

      let functionCall: 'auto' | 'none' | { name: string } | undefined;
      if (options.functionCall) {
        if (options.functionCall === 'auto' || options.functionCall === 'none') {
          functionCall = options.functionCall;
        } else {
          functionCall = { name: options.functionCall };
        }
      }

      return {
        ...baseParams,
        functions,
        function_call: functionCall,
      } as ChatCompletionCreateParamsNonStreaming | ChatCompletionCreateParamsStreaming;
    }

    return baseParams as ChatCompletionCreateParamsNonStreaming | ChatCompletionCreateParamsStreaming;
  }

  private mapFinishReason(
    reason: string | null | undefined
  ): GenerationResult['finishReason'] {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'function_call':
        return 'function_call';
      case 'content_filter':
        return 'content_filter';
      default:
        return 'error';
    }
  }

  private handleOpenAIError(error: unknown): LLMError {
    const err = error as { code?: string; status?: number; message?: string };
    const message = err.message ?? 'Unknown OpenAI error';

    if (err.code === 'invalid_api_key' || err.status === 401) {
      return new LLMError(message, 'INVALID_API_KEY', error as Error);
    }

    if (err.code === 'rate_limit_exceeded' || err.status === 429) {
      return new LLMError(message, 'RATE_LIMIT', error as Error);
    }

    if (
      err.code === 'context_length_exceeded' ||
      message.includes('maximum context length')
    ) {
      return new LLMError(message, 'CONTEXT_LENGTH', error as Error);
    }

    if (err.code === 'content_filter' || message.includes('content policy')) {
      return new LLMError(message, 'CONTENT_FILTER', error as Error);
    }

    if (err.code === 'model_not_found' || err.status === 404) {
      return new LLMError(message, 'MODEL_NOT_FOUND', error as Error);
    }

    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return new LLMError(message, 'NETWORK_ERROR', error as Error);
    }

    if (err.status === 400) {
      return new LLMError(message, 'INVALID_REQUEST', error as Error);
    }

    return new LLMError(message, 'UNKNOWN_ERROR', error as Error);
  }
}
