/**
 * @ybis/llm - Large Language Model abstraction package
 *
 * Exports:
 * - LLMPort: Abstract interface for LLM operations
 * - OpenAIAdapter: OpenAI implementation (Closed Beta - GPT-4o-mini)
 * - LLMError: Standard error type
 * - Types: Message, MessageRole, GenerationOptions, GenerationResult, StreamChunk, etc.
 */

// Re-export port interface from @ybis/core
export type {
  LLMPort,
  Message,
  MessageRole,
  FunctionDefinition,
  FunctionCall,
  GenerationOptions,
  GenerationResult,
  StreamChunk,
} from '@ybis/core';

// Re-export error class
export { LLMError } from '@ybis/core';

// Adapters
export { OpenAIAdapter } from './adapters/OpenAIAdapter';
export type { OpenAIConfig } from './adapters/OpenAIAdapter';
