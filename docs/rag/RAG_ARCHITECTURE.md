# RAG Architecture Documentation

**Version:** 1.0  
**Last Updated:** 2025-10-19  
**Status:** Design Phase - Week 5-6 Implementation  
**Related:** [AD-034](../Güncel/DEVELOPMENT_LOG.md#AD-034)

---

## 🎯 Overview

RAG (Retrieval Augmented Generation) enables YBIS AI to understand and retrieve user's historical data (notes, calendar, tasks) to provide intelligent, context-aware responses.

**Core Value:** Without RAG, YBIS = basic notes app. With RAG = smart AI assistant.

---

## 🏗️ Architecture Design

### Port Architecture Pattern

```typescript
// Interface (stable, never changes)
interface RAGPort {
  embed(text: string): Promise<number[]>;
  search(query: string, options: RAGSearchOptions): Promise<RAGResult[]>;
  addDocument(doc: RAGDocument): Promise<void>;
  deleteDocument(id: string): Promise<void>;
  selectContext(query: string, sources: RAGSource[]): Promise<RAGContext>;
}

// Implementation (swappable)
class SupabaseRAGAdapter implements RAGPort {
  // Tier 1: Basic implementation
}
```

### Tier Evolution Strategy

| Tier | Implementation | Features | Timeline |
|------|----------------|----------|----------|
| **Tier 1** | SupabaseRAGAdapter | Basic embedding + search | Week 5-6 (Closed Beta) |
| **Tier 2** | SmartRAGAdapter | Semantic cache + context broker | Week 11-12 (Open Beta) |
| **Tier 3** | AdvancedRAGAdapter | Proactive + user learning | MVP+ |

---

## 📊 Data Flow

### 1. Document Ingestion
```
User creates note/calendar/task
    ↓
Background job: embedNewContent.ts
    ↓
OpenAI text-embedding-3-small
    ↓
Supabase pgvector storage
```

### 2. Query Processing
```
User query: "Geçen hafta React notum neydi?"
    ↓
RAGPort.search(query, {sources: ['notes']})
    ↓
Vector similarity search (pgvector)
    ↓
Top 5 results (similarity > 0.7)
    ↓
AI prompt with context
    ↓
Intelligent response
```

### 3. Context Selection
```typescript
const context = await rag.selectContext(query, ['notes', 'calendar']);
// Returns: RAGContext with relevant documents
```

---

## 🗄️ Database Schema

### Supabase Migration
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('notes', 'calendar', 'tasks', 'flows')),
  source_id UUID NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),  -- OpenAI text-embedding-3-small
  metadata JSONB DEFAULT '{}',
  
  -- Future-proof columns (Tier 2/3)
  user_preference_score FLOAT DEFAULT 0,
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);

-- Source filtering index
CREATE INDEX ON embeddings (source);
```

---

## 🔧 Implementation Details

### Package Structure
```
packages/@ybis/rag/
├── src/
│   ├── ports/
│   │   └── RAGPort.ts              # Interface
│   ├── adapters/
│   │   ├── SupabaseRAGAdapter.ts   # Tier 1
│   │   ├── SmartRAGAdapter.ts      # Tier 2 (future)
│   │   └── AdvancedRAGAdapter.ts   # Tier 3 (future)
│   ├── types/
│   │   ├── RAGDocument.ts
│   │   ├── RAGResult.ts
│   │   └── RAGContext.ts
│   ├── services/
│   │   └── EmbeddingService.ts     # OpenAI wrapper
│   └── errors/
│       └── RAGError.ts
├── package.json
└── tsconfig.json
```

### Key Interfaces
```typescript
export interface RAGDocument {
  id: string;
  source: RAGSource;
  sourceId: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  createdAt: Date;
}

export interface RAGResult {
  id: string;
  source: RAGSource;
  sourceId: string;
  content: string;
  similarity: number;  // 0-1
  metadata: Record<string, unknown>;
}

export interface RAGContext {
  documents: RAGResult[];
  totalFound: number;
  query: string;
}
```

---

## 💰 Cost Analysis

### Closed Beta (100 users, 2 months)
- **Embedding:** 10K docs × $0.00002 = $0.20 one-time
- **Monthly searches:** 1K/user × 100 users = 100K searches × $0.00002 = $2/month
- **Supabase:** Free tier (500 MB)
- **Total: $5/month**

### Open Beta (500 users, 2 months)
- **Embedding:** 50K docs × $0.00002 = $1 one-time
- **Monthly searches:** 500K × $0.00002 = $10/month → cache reduces to $5!
- **Redis cache:** $3/month
- **Total: $8-10/month**

### MVP (5K users)
- **Embedding:** 500K docs × $0.00002 = $10 one-time
- **Monthly searches:** 5M × $0.00002 = $100/month → cache reduces to $40
- **Redis:** $10/month
- **Supabase paid:** $25/month
- **Total: $75/month**

**LTV Assumption:** $10/user/month → **99% margin!** 🎉

---

## 🚀 Integration Guide

### Backend Integration
```typescript
// apps/backend/src/config/services.ts
import { SupabaseRAGAdapter } from '@ybis/rag';
import { EmbeddingService } from '@ybis/rag/services';

export const configureServices = () => {
  const supabase = new SupabaseClient(/* ... */);
  const embedder = new EmbeddingService(process.env.OPENAI_API_KEY!);
  
  const rag = new SupabaseRAGAdapter(supabase, embedder);
  
  return { rag, /* other services */ };
};
```

### Mobile Integration
```typescript
// apps/mobile/src/hooks/useRAG.ts
import { useQuery } from '@tanstack/react-query';
import { useServices } from '@/config/services';

export const useRAGSearch = (query: string, sources: RAGSource[]) => {
  const { rag } = useServices();
  
  return useQuery({
    queryKey: ['rag-search', query, sources],
    queryFn: () => rag.search(query, { sources }),
    enabled: query.length > 3,
    staleTime: 5 * 60 * 1000,  // 5 min cache
  });
};
```

### AI Integration
```typescript
// AI prompt with RAG context
const context = await rag.selectContext(userQuery, ['notes', 'calendar']);
const prompt = `
Context: ${context.documents.map(d => d.content).join('\n')}

User: ${userQuery}
Assistant: [intelligent response using context]
`;
```

---

## 🔄 Migration Path

### Tier 1 → Tier 2 (Open Beta)
```typescript
// Zero code change - just swap adapter!
const basicRAG = new SupabaseRAGAdapter(supabase, embedder);
const cache = new RedisCache();
const contextBroker = new ContextBroker();
const rag = new SmartRAGAdapter(basicRAG, cache, contextBroker);
```

### Tier 2 → Tier 3 (MVP)
```typescript
// Zero code change - just swap adapter!
const smartRAG = new SmartRAGAdapter(basicRAG, cache, contextBroker);
const proactive = new ProactiveEngine(db);
const learner = new UserPreferenceLearner(db);
const rag = new AdvancedRAGAdapter(smartRAG, proactive, learner);
```

---

## 📈 Success Metrics

### Week 5-6 (Tier 1)
- ✅ RAGPort interface defined (zero `any`)
- ✅ SupabaseRAGAdapter working (can embed + search)
- ✅ AI uses RAG context in responses
- ✅ Background embedding pipeline functional
- ✅ 70%+ test coverage
- ✅ Cost < $5/month (100 users)

### Open Beta (Tier 2)
- ✅ Semantic cache hit rate > 60%
- ✅ Context quality improvement (user feedback)
- ✅ Cost reduction 40-50% (cache savings)
- ✅ Query latency < 300ms (p95)

### MVP (Tier 3)
- ✅ Proactive suggestions accuracy > 70%
- ✅ User preference learning (test scenarios)
- ✅ Multi-index optimization
- ✅ Advanced reasoning chains

---

## 🔒 Security & Privacy

### Data Protection
- **Embeddings:** No PII in vectors (only semantic meaning)
- **Metadata:** Minimal, no sensitive data
- **RLS:** Row-level security (users see only their data)
- **Encryption:** TLS 1.3 for all API calls

### Rate Limiting
- **Embedding:** 100 requests/minute per user
- **Search:** 1000 requests/minute per user
- **Cost alerts:** Alert if > $10/month per user

---

## 🐛 Error Handling

### RAGError Class
```typescript
export class RAGError extends Error {
  constructor(
    message: string,
    public code: RAGErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = 'RAGError';
  }
}

export enum RAGErrorCode {
  EMBEDDING_FAILED = 'EMBEDDING_FAILED',
  SEARCH_FAILED = 'SEARCH_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  INVALID_INPUT = 'INVALID_INPUT',
}
```

### Graceful Degradation
- **No results:** Return empty array (no crash)
- **API failure:** Fallback to basic search
- **Rate limit:** Queue requests, retry later
- **Invalid input:** Validation error with helpful message

---

## 📚 Related Documentation

- [TIER_EVOLUTION.md](./TIER_EVOLUTION.md) - Detailed tier progression
- [MCP_INTEGRATION_PLAN.md](../mcp/MCP_INTEGRATION_PLAN.md) - Future MCP integration
- [DEVELOPMENT_LOG.md](../Güncel/DEVELOPMENT_LOG.md#AD-034) - Architecture decision
- [PRODUCT_ROADMAP.md](../roadmap/PRODUCT_ROADMAP.md) - Timeline alignment

---

**Maintained By:** YBIS AI System  
**Next Review:** Week 5 completion (implementation validation)
