/**
 * LLM routes - AI text generation endpoints
 */

import { Hono } from 'hono';
import { LLMError } from '@ybis/llm';

const llm = new Hono();

/**
 * POST /llm/generate
 * Generate text from a simple prompt
 *
 * Body:
 * {
 *   "prompt": "Write a haiku about coding",
 *   "temperature": 0.7,
 *   "maxTokens": 100
 * }
 */
llm.post('/generate', async (c) => {
  try {
    const llmPort = c.get('llm');
    const { prompt, temperature, maxTokens } = await c.req.json();

    if (!prompt || typeof prompt !== 'string') {
      return c.json({ error: 'Prompt is required' }, 400);
    }

    const result = await llmPort.generate(prompt, {
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 1000,
    });

    return c.json({
      content: result.content,
      usage: result.usage,
      model: result.model,
      finishReason: result.finishReason,
    });
  } catch (error) {
    if (error instanceof LLMError) {
      return c.json({ error: error.message, code: error.code }, 500);
    }
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /llm/chat
 * Chat with multi-turn conversation
 *
 * Body:
 * {
 *   "messages": [
 *     { "role": "user", "content": "Hello!" },
 *     { "role": "assistant", "content": "Hi!" },
 *     { "role": "user", "content": "Tell me a joke" }
 *   ],
 *   "temperature": 0.8
 * }
 */
llm.post('/chat', async (c) => {
  try {
    const llmPort = c.get('llm');
    const { messages, temperature, maxTokens } = await c.req.json();

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: 'Messages array is required' }, 400);
    }

    const result = await llmPort.chat(messages, {
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 1000,
    });

    return c.json({
      content: result.content,
      usage: result.usage,
      model: result.model,
      finishReason: result.finishReason,
    });
  } catch (error) {
    if (error instanceof LLMError) {
      return c.json({ error: error.message, code: error.code }, 500);
    }
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /llm/embed
 * Create vector embedding for text
 *
 * Body:
 * {
 *   "text": "This is a sample text to embed"
 * }
 */
llm.post('/embed', async (c) => {
  try {
    const llmPort = c.get('llm');
    const { text } = await c.req.json();

    if (!text || typeof text !== 'string') {
      return c.json({ error: 'Text is required' }, 400);
    }

    const embedding = await llmPort.embed(text);

    return c.json({
      embedding,
      dimensions: embedding.length,
    });
  } catch (error) {
    if (error instanceof LLMError) {
      return c.json({ error: error.message, code: error.code }, 500);
    }
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default llm;
