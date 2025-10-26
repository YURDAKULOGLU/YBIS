import Logger from '@ybis/logging';
import type { Message as LLMMessage, GenerationResult } from '@ybis/llm';

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

function getApiBaseUrl(): string {
  const configured = process.env['EXPO_PUBLIC_API_BASE_URL'];
  if (configured && configured.trim().length > 0) {
    return configured.replace(/\/$/, '');
  }
  Logger.warn('Falling back to default API base URL for chat gateway', {
    type: 'CONFIG',
  });
  return DEFAULT_API_BASE_URL;
}

export interface ChatGatewayOptions {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface ChatGatewayResponse {
  content: string;
  finishReason: GenerationResult['finishReason'];
  model: string;
  usage?: GenerationResult['usage'];
}

/**
 * Minimal HTTP gateway for the backend `/api/llm/chat` route.
 */
export async function chatWithLLM(
  messages: LLMMessage[],
  options: ChatGatewayOptions = {}
): Promise<ChatGatewayResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/llm/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens ?? 800,
    }),
    signal: options.signal,
  });

  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (error) {
    Logger.error('Failed to parse chat gateway response', error as Error, {
      type: 'NETWORK',
      responseText: text,
    });
    throw new Error('Beklenmeyen chat yanıtı alındı.');
  }

  if (!response.ok) {
    const errorMessage =
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? String((payload as { error?: unknown }).error ?? 'Sunucu hatası')
        : `Chat isteği ${response.status} kodu ile döndü`;
    Logger.error('Chat gateway request failed', new Error(errorMessage), {
      type: 'NETWORK',
      status: response.status,
      payload,
    });
    throw new Error(errorMessage);
  }

  const content =
    typeof payload === 'object' && payload !== null && 'content' in payload
      ? (payload as { content: string }).content
      : undefined;

  if (!content) {
    Logger.error('Chat gateway payload missing content field', new Error('Invalid payload'), {
      type: 'NETWORK',
      payload,
    });
    throw new Error('Chat servisi geçersiz bir yanıt döndürdü.');
  }

  return {
    content,
    finishReason:
      typeof payload === 'object' && payload !== null && 'finishReason' in payload
        ? ((payload as { finishReason?: GenerationResult['finishReason'] }).finishReason ?? 'stop')
        : 'stop',
    model:
      typeof payload === 'object' && payload !== null && 'model' in payload
        ? String((payload as { model?: string }).model ?? 'unknown')
        : 'unknown',
    usage:
      typeof payload === 'object' && payload !== null && 'usage' in payload
        ? (payload as { usage?: GenerationResult['usage'] }).usage
        : undefined,
  };
}
