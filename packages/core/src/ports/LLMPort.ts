/**
 * LLMPort - Large Language Model abstraction interface
 *
 * Closed Beta: OpenAI GPT-4o-mini
 * MVP: Multi-provider (OpenAI, Anthropic, Google)
 *
 * This port allows swapping LLM providers without changing app code.
 */

/**
 * Message role in conversation
 */
export type MessageRole = 'system' | 'user' | 'assistant';

/**
 * Single message in conversation
 */
export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * Function definition for function calling
 */
export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

/**
 * Function call result from LLM
 */
export interface FunctionCall {
  name: string;
  arguments: string; // JSON string
}

/**
 * Generation options
 */
export interface GenerationOptions {
  /**
   * Model name (e.g., "gpt-4o-mini", "claude-3-5-sonnet-20241022")
   * If not specified, uses adapter's default model
   */
  model?: string;

  /**
   * Sampling temperature (0.0 - 2.0)
   * Lower = more deterministic, Higher = more creative
   * Default: 0.7
   */
  temperature?: number;

  /**
   * Maximum tokens to generate
   * Default: 1000
   */
  maxTokens?: number;

  /**
   * Top-p sampling (nucleus sampling)
   * Default: 1.0
   */
  topP?: number;

  /**
   * Stop sequences
   */
  stopSequences?: string[];

  /**
   * Enable streaming
   * Default: false
   */
  stream?: boolean;

  /**
   * Available functions for function calling
   */
  functions?: FunctionDefinition[];

  /**
   * Force function call (auto, none, or specific function name)
   */
  functionCall?: 'auto' | 'none' | string;
}

/**
 * Generation result (non-streaming)
 */
export interface GenerationResult {
  /**
   * Generated text content
   */
  content: string;

  /**
   * Function call (if model chose to call a function)
   */
  functionCall?: FunctionCall;

  /**
   * Token usage statistics
   */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  /**
   * Finish reason
   */
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter' | 'error';

  /**
   * Model used for generation
   */
  model: string;
}

/**
 * Streaming chunk
 */
export interface StreamChunk {
  /**
   * Delta content (incremental text)
   */
  content: string;

  /**
   * Is this the final chunk?
   */
  done: boolean;

  /**
   * Function call (if model is calling a function)
   */
  functionCall?: Partial<FunctionCall>;
}

/**
 * LLMPort - Abstract interface for LLM operations
 *
 * Implementations:
 * - OpenAIAdapter (Closed Beta) - GPT-4o-mini
 * - AnthropicAdapter (MVP) - Claude 3.5 Sonnet
 * - GeminiAdapter (Future) - Gemini Pro
 * - MockLLMAdapter (Testing)
 */
export interface LLMPort {
  /**
   * Initialize LLM connection
   * @param apiKey API key for the provider
   */
  initialize(apiKey: string): Promise<void>;

  /**
   * Check if LLM is initialized and healthy
   */
  healthCheck(): Promise<boolean>;

  /**
   * Generate text from a single prompt (simple mode)
   * @param prompt User prompt
   * @param options Generation options
   */
  generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult>;

  /**
   * Generate text from conversation messages (chat mode)
   * @param messages Conversation history
   * @param options Generation options
   */
  chat(messages: Message[], options?: GenerationOptions): Promise<GenerationResult>;

  /**
   * Generate streaming response
   * @param prompt User prompt or messages
   * @param options Generation options (must include stream: true)
   * @returns Async iterator of chunks
   */
  stream(
    prompt: string | Message[],
    options?: GenerationOptions
  ): AsyncIterableIterator<StreamChunk>;

  /**
   * Embed text into vector representation
   * @param text Text to embed
   * @returns Vector embedding
   */
  embed(text: string): Promise<number[]>;

  /**
   * Count tokens in text (for cost estimation)
   * @param text Text to count
   * @returns Token count
   */
  countTokens(text: string): Promise<number>;
}

/**
 * Custom error types for LLM operations
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public code:
      | 'NOT_INITIALIZED'      // LLM not initialized
      | 'INVALID_API_KEY'      // Invalid or missing API key
      | 'RATE_LIMIT'           // Rate limit exceeded
      | 'CONTEXT_LENGTH'       // Context length exceeded
      | 'CONTENT_FILTER'       // Content policy violation
      | 'MODEL_NOT_FOUND'      // Requested model not available
      | 'NETWORK_ERROR'        // Network/connectivity error
      | 'INVALID_REQUEST'      // Malformed request
      | 'UNKNOWN_ERROR',       // Unexpected error
    public originalError?: Error
  ) {
    super(message);
    this.name = 'LLMError';
  }
}
