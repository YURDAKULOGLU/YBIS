# YBIS Service Integration Strategy

**Version:** 1.1.0
**Last Updated:** 2025-10-12
**Status:** Planning (Auth strategy updated - Expo Auth Session)
**Related:** `YBIS_PROJE_ANAYASASI.md` v2.0.0 (Port Architecture)

---

## 🎯 Overview

YBIS roadmap'te 10+ external service integration planlanmış. Bu doküman, service integration'ları yönetmek için **scalable, maintainable, testable** bir strateji tanımlar.

**Core Philosophy:** Port Architecture + Integration Hub Pattern

---

## 📊 Planned Integrations by Phase

### Closed Beta (Existing)
1. ✅ **Firebase Auth** - Google Sign-In (AuthPort)
2. ✅ **Supabase** - Database + Storage (DatabasePort, StoragePort)
3. ✅ **OpenAI GPT-4o-mini** - LLM (LLMPort)

### Open Beta (New - 4 integrations)
4. 🔜 **Gmail API** - Email summarization, action extraction
5. 🔜 **Google Calendar API** - Two-way calendar sync
6. 🔜 **Google Tasks API** - Task management sync
7. 🔜 **Google Contacts API** - Contact information access

### MVP Release (Deferred - 3+ integrations)
8. 📅 **Todoist API** - Third-party task integration
9. 📅 **Slack API** - Team communication
10. 📅 **Notion API** - Note sync (if requested)
11. 📅 **Zapier/Make** - No-code automation (future)

### Scale Phase (Enterprise - N integrations)
12. 🚀 **Microsoft Graph API** - Office 365 integration
13. 🚀 **Salesforce API** - CRM integration
14. 🚀 **SAP API** - Enterprise integration
15. 🚀 **Integration Marketplace** - User-installable integrations

---

## 🏗️ Architecture: Integration Hub Pattern

### Problem with Direct Integration

**❌ Anti-pattern (Direct service calls everywhere):**
```typescript
// ❌ BAD: Direct Gmail calls scattered in codebase
import { gmail_v1 } from '@googleapis/gmail';

async function summarizeEmail(emailId: string) {
  const gmail = google.gmail({ version: 'v1', auth });
  const email = await gmail.users.messages.get({ userId: 'me', id: emailId });
  // Business logic mixed with API calls
}
```

**Problems:**
- Service logic mixed with business logic
- Hard to test
- Hard to swap providers
- No centralized error handling
- No retry logic
- No rate limiting

---

### Solution: Integration Hub + Port Architecture

**✅ Clean Architecture:**

```
Business Logic (Features)
         ↓
   Integration Ports (Interfaces)
         ↓
   Integration Hub (Orchestration)
         ↓
   Service Adapters (Implementations)
         ↓
   External APIs (Gmail, Calendar, etc.)
```

---

## 📐 Implementation Pattern

### 1. Define Integration Port

```typescript
// packages/core/src/ports/EmailIntegrationPort.ts

export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: Date;
  labels: string[];
}

export interface EmailSummary {
  subject: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ActionItem {
  text: string;
  type: 'task' | 'event' | 'reply';
  dueDate?: Date;
}

/**
 * EmailIntegrationPort - Abstract interface for email integration
 *
 * Implementations:
 * - GmailAdapter (Open Beta)
 * - OutlookAdapter (Scale Phase)
 * - NoOpAdapter (Development/Testing)
 */
export interface EmailIntegrationPort {
  // Connection
  connect(credentials: OAuthCredentials): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;

  // Email fetching
  getRecentEmails(limit: number): Promise<Email[]>;
  getEmailById(id: string): Promise<Email>;
  searchEmails(query: string): Promise<Email[]>;

  // AI-powered features
  summarizeEmail(emailId: string): Promise<EmailSummary>;
  extractActionItems(emailId: string): Promise<ActionItem[]>;

  // Actions
  sendEmail(to: string[], subject: string, body: string): Promise<void>;
  markAsRead(emailId: string): Promise<void>;
  archive(emailId: string): Promise<void>;

  // Sync
  subscribeToNewEmails(callback: (email: Email) => void): () => void;
}

export class EmailIntegrationError extends Error {
  constructor(
    message: string,
    public code: 'AUTH_FAILED' | 'RATE_LIMIT' | 'API_ERROR' | 'NETWORK_ERROR',
    public originalError?: Error
  ) {
    super(message);
    this.name = 'EmailIntegrationError';
  }
}
```

---

### 2. Create Service Adapter

```typescript
// packages/integrations/src/adapters/GmailAdapter.ts

import { google, gmail_v1 } from '@googleapis/gmail';
import type { EmailIntegrationPort, Email, EmailSummary } from '@ybis/core';

export class GmailAdapter implements EmailIntegrationPort {
  private gmail: gmail_v1.Gmail | null = null;
  private auth: any = null;

  async connect(credentials: OAuthCredentials): Promise<void> {
    try {
      this.auth = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri
      );
      this.auth.setCredentials({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
      });

      this.gmail = google.gmail({ version: 'v1', auth: this.auth });

      // Verify connection
      await this.gmail.users.getProfile({ userId: 'me' });
    } catch (error) {
      throw new EmailIntegrationError(
        'Failed to connect to Gmail',
        'AUTH_FAILED',
        error as Error
      );
    }
  }

  async disconnect(): Promise<void> {
    this.gmail = null;
    this.auth = null;
  }

  async isConnected(): Promise<boolean> {
    if (!this.gmail) return false;
    try {
      await this.gmail.users.getProfile({ userId: 'me' });
      return true;
    } catch {
      return false;
    }
  }

  async getRecentEmails(limit: number = 10): Promise<Email[]> {
    this.ensureConnected();

    try {
      const response = await this.gmail!.users.messages.list({
        userId: 'me',
        maxResults: limit,
        q: 'in:inbox',
      });

      const messageIds = response.data.messages?.map((m) => m.id!) || [];
      const emails = await Promise.all(
        messageIds.map((id) => this.getEmailById(id))
      );

      return emails;
    } catch (error) {
      throw new EmailIntegrationError(
        'Failed to fetch recent emails',
        'API_ERROR',
        error as Error
      );
    }
  }

  async getEmailById(id: string): Promise<Email> {
    this.ensureConnected();

    try {
      const response = await this.gmail!.users.messages.get({
        userId: 'me',
        id,
        format: 'full',
      });

      return this.mapGmailMessage(response.data);
    } catch (error) {
      throw new EmailIntegrationError(
        `Failed to fetch email ${id}`,
        'API_ERROR',
        error as Error
      );
    }
  }

  async summarizeEmail(emailId: string): Promise<EmailSummary> {
    const email = await this.getEmailById(emailId);

    // Use LLMPort to generate summary
    const llm = this.getLLMService();
    const summary = await llm.chat([
      {
        role: 'system',
        content: 'You are an email summarization assistant. Extract key points and action items.',
      },
      {
        role: 'user',
        content: `Summarize this email:\n\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`,
      },
    ]);

    return JSON.parse(summary.content);
  }

  // ... other methods

  private ensureConnected(): void {
    if (!this.gmail) {
      throw new EmailIntegrationError(
        'Not connected to Gmail. Call connect() first.',
        'AUTH_FAILED'
      );
    }
  }

  private mapGmailMessage(message: gmail_v1.Schema$Message): Email {
    const headers = message.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    return {
      id: message.id!,
      from: getHeader('from'),
      to: getHeader('to').split(',').map((e) => e.trim()),
      subject: getHeader('subject'),
      body: this.extractBody(message.payload),
      receivedAt: new Date(parseInt(message.internalDate || '0')),
      labels: message.labelIds || [],
    };
  }

  private extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
    // Complex logic to extract body from Gmail message structure
    // Handle text/plain, text/html, multipart, etc.
    // ...
    return '';
  }
}
```

---

### 3. Create Integration Hub

```typescript
// packages/integrations/src/IntegrationHub.ts

import type {
  EmailIntegrationPort,
  CalendarIntegrationPort,
  TaskIntegrationPort,
  ContactIntegrationPort,
} from '@ybis/core';

export interface IntegrationHubConfig {
  email?: EmailIntegrationPort;
  calendar?: CalendarIntegrationPort;
  tasks?: TaskIntegrationPort;
  contacts?: ContactIntegrationPort;
}

/**
 * IntegrationHub - Centralized integration management
 *
 * Responsibilities:
 * - Manage integration lifecycle (connect, disconnect)
 * - Provide unified error handling
 * - Handle rate limiting across all integrations
 * - Centralized logging and monitoring
 */
export class IntegrationHub {
  private integrations: IntegrationHubConfig = {};
  private rateLimiter: RateLimiter;
  private logger: LoggerPort;

  constructor(logger: LoggerPort) {
    this.logger = logger;
    this.rateLimiter = new RateLimiter({
      maxRequests: 100,
      windowMs: 60000, // 100 requests per minute
    });
  }

  // Register integrations
  registerEmailIntegration(adapter: EmailIntegrationPort): void {
    this.integrations.email = adapter;
    this.logger.info('Email integration registered', { adapter: adapter.constructor.name });
  }

  registerCalendarIntegration(adapter: CalendarIntegrationPort): void {
    this.integrations.calendar = adapter;
    this.logger.info('Calendar integration registered', { adapter: adapter.constructor.name });
  }

  // Get integrations with rate limiting
  async getEmailIntegration(): Promise<EmailIntegrationPort> {
    await this.rateLimiter.acquire('email');

    if (!this.integrations.email) {
      throw new Error('Email integration not registered');
    }

    return this.integrations.email;
  }

  // Connection management
  async connectAll(credentials: Record<string, OAuthCredentials>): Promise<void> {
    const promises = [];

    if (this.integrations.email && credentials.email) {
      promises.push(
        this.integrations.email.connect(credentials.email).catch((error) => {
          this.logger.error('Failed to connect email integration', error);
          throw error;
        })
      );
    }

    if (this.integrations.calendar && credentials.calendar) {
      promises.push(
        this.integrations.calendar.connect(credentials.calendar).catch((error) => {
          this.logger.error('Failed to connect calendar integration', error);
          throw error;
        })
      );
    }

    await Promise.all(promises);
    this.logger.info('All integrations connected');
  }

  async disconnectAll(): Promise<void> {
    const promises = Object.values(this.integrations)
      .filter((integration) => integration)
      .map((integration) => integration!.disconnect());

    await Promise.all(promises);
    this.logger.info('All integrations disconnected');
  }

  // Health check
  async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    if (this.integrations.email) {
      health.email = await this.integrations.email.isConnected();
    }

    if (this.integrations.calendar) {
      health.calendar = await this.integrations.calendar.isConnected();
    }

    return health;
  }
}

// Rate limiter implementation
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: { maxRequests: number; windowMs: number };

  constructor(config: { maxRequests: number; windowMs: number }) {
    this.config = config;
  }

  async acquire(key: string): Promise<void> {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(
      (ts) => now - ts < this.config.windowMs
    );

    if (validTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = validTimestamps[0];
      const waitTime = this.config.windowMs - (now - oldestTimestamp);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquire(key); // Retry
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
  }
}
```

---

### 4. Usage in Application

```typescript
// apps/mobile/src/services/integration/integrationService.ts

import { IntegrationHub } from '@ybis/integrations';
import { GmailAdapter } from '@ybis/integrations/adapters';
import { GoogleCalendarAdapter } from '@ybis/integrations/adapters';
import { consoleLogger } from '@ybis/core';

// Create integration hub
export const integrationHub = new IntegrationHub(consoleLogger);

// Register adapters
integrationHub.registerEmailIntegration(new GmailAdapter());
integrationHub.registerCalendarIntegration(new GoogleCalendarAdapter());

// Connect all integrations (after user OAuth)
export async function connectIntegrations(credentials: OAuthCredentials): Promise<void> {
  await integrationHub.connectAll({
    email: credentials,
    calendar: credentials, // Same Google OAuth token
  });
}

// Usage in features
export async function summarizeRecentEmails(): Promise<EmailSummary[]> {
  const emailIntegration = await integrationHub.getEmailIntegration();
  const emails = await emailIntegration.getRecentEmails(10);

  const summaries = await Promise.all(
    emails.map((email) => emailIntegration.summarizeEmail(email.id))
  );

  return summaries;
}
```

---

## 🎯 Integration Tiers

### Tier 1: Critical (Closed Beta)
- ✅ Firebase Auth
- ✅ Supabase
- ✅ OpenAI

**Characteristics:** Zero downtime tolerance, immediate alerts

### Tier 2: Core (Open Beta)
- 🔜 Gmail
- 🔜 Google Calendar
- 🔜 Google Tasks

**Characteristics:** Degraded mode acceptable, retry logic

### Tier 3: Enhancement (MVP+)
- 📅 Todoist
- 📅 Slack
- 📅 Notion

**Characteristics:** Optional features, graceful fallback

---

## 🛡️ Error Handling Strategy

### 1. Error Classification

```typescript
export type IntegrationErrorCode =
  | 'AUTH_FAILED'      // OAuth token expired/invalid
  | 'RATE_LIMIT'       // API rate limit exceeded
  | 'API_ERROR'        // API returned error
  | 'NETWORK_ERROR'    // Network connectivity issue
  | 'TIMEOUT'          // Request timeout
  | 'INVALID_DATA';    // Data validation failed
```

### 2. Retry Strategy

```typescript
const retryConfig = {
  AUTH_FAILED: { retries: 0, action: 'REAUTH' },
  RATE_LIMIT: { retries: 3, backoff: 'exponential' },
  API_ERROR: { retries: 2, backoff: 'linear' },
  NETWORK_ERROR: { retries: 3, backoff: 'exponential' },
  TIMEOUT: { retries: 2, backoff: 'linear' },
  INVALID_DATA: { retries: 0, action: 'LOG_AND_SKIP' },
};
```

### 3. Fallback Behavior

- **Gmail fails:** Show cached emails, queue send for later
- **Calendar fails:** Show local events, queue sync for later
- **Tasks fails:** Work offline, sync when reconnected

---

## 📊 Monitoring & Observability

### Metrics to Track

1. **Integration Health**
   - Connection success rate
   - API error rate by integration
   - Average response time

2. **Rate Limiting**
   - Rate limit hits per integration
   - Quota usage percentage

3. **User Impact**
   - % users with integrations connected
   - Features disabled due to integration failures

### Logging Strategy

```typescript
logger.info('Gmail integration: Fetched emails', {
  integration: 'gmail',
  operation: 'getRecentEmails',
  count: 10,
  duration: 1234,
});

logger.error('Gmail integration: Rate limit exceeded', {
  integration: 'gmail',
  operation: 'getRecentEmails',
  errorCode: 'RATE_LIMIT',
  retryAfter: 60,
});
```

---

## 🔐 Security Considerations

### OAuth Token Management

1. **Storage:** Encrypted in Supabase user metadata
2. **Refresh:** Automatic refresh before expiry
3. **Revocation:** User can disconnect anytime

### API Key Security

1. **Backend-only:** Never expose API keys in mobile app
2. **Rotation:** Monthly API key rotation
3. **Monitoring:** Alert on unusual API usage

### Data Privacy

1. **Minimal Scope:** Request minimum OAuth scopes
2. **User Control:** Clear consent for each integration
3. **Data Retention:** Clear policy for cached integration data

---

## 🚀 Progressive Protocol Strategy: Port Architecture → MCP

### Strategy Overview

YBIS integration strategy follows **progressive enhancement** philosophy:
- **Phase 0-1**: Port Architecture (manual, curated, 10-20 integrations)
- **Phase 2**: MCP Layer Research & Pilot (standardized, 50-100 integrations)
- **Phase 3**: Integration Marketplace (unlimited, third-party developers)

**Decision Point:** MCP adoption depends on:
- ✅ Integration count >20
- ✅ Third-party developer demand
- ✅ Marketplace revenue model validated

---

## 📅 Implementation Timeline

### Phase 0: Closed Beta (Week 1-6) - **Port Architecture ONLY**

**Goal:** Fast time-to-market with 3 core integrations

**Integration Count:** 3 (Firebase, Supabase, OpenAI)

**Implementation:**
- ✅ Port Architecture (AuthPort, DatabasePort, LLMPort, StoragePort)
- ✅ Firebase Auth adapter
- ✅ Supabase Database + Storage adapter
- ✅ OpenAI LLM adapter
- ✅ Basic error handling

**No MCP Yet:** Too much overhead for 3 integrations

---

### Phase 1: Open Beta (Week 7-14) - **Port Architecture + Integration Hub**

**Goal:** Google Workspace integration with centralized management

**Integration Count:** 7 (3 existing + 4 new)

**New Integrations:**
1. Gmail API (EmailIntegrationPort)
2. Google Calendar API (CalendarIntegrationPort)
3. Google Tasks API (TaskIntegrationPort)
4. Google Contacts API (ContactIntegrationPort)

**Implementation:**
- 🔧 Create IntegrationHub base (Week 1-2)
  - Rate limiter implementation
  - Error handling framework
  - Health monitoring
  - Centralized OAuth management

- 🔧 Google Workspace OAuth (Week 1)
  - OAuth 2.0 flow
  - Token refresh automation
  - Scope management

- 🔧 GmailAdapter (Week 2)
  - Email fetching
  - AI summarization (via LLMPort)
  - Action item extraction
  - Send/archive actions

- 🔧 GoogleCalendarAdapter (Week 3)
  - Event fetching
  - Two-way sync
  - Calendar creation
  - Conflict resolution

- 🔧 GoogleTasksAdapter (Week 4)
  - Task sync
  - YBIS task → Google Task mapping
  - Bi-directional updates

- 🔧 GoogleContactsAdapter (Week 4)
  - Contact fetching
  - Basic contact info access

**MCP Research (Parallel Work):**
- 📚 Study MCP protocol documentation
- 📚 Review Anthropic MCP examples
- 📚 Evaluate feasibility for YBIS

**Still Port Architecture:** 7 integrations manageable without MCP

---

### Phase 2: MVP Release (Month 3-6) - **MCP Decision Point**

**Goal:** Decide MCP adoption based on integration roadmap

**Integration Target:** 15-20 integrations

**New Integrations (Planned):**
8. Todoist API (TaskIntegrationPort)
9. Slack API (NotificationIntegrationPort)
10. Notion API (NoteIntegrationPort)
11. Trello API (TaskIntegrationPort)
12. Linear API (TaskIntegrationPort)
13. Asana API (TaskIntegrationPort)

**MCP Pilot (if >20 integrations planned):**

**Week 1-2: MCP Infrastructure**
```typescript
// packages/integrations/src/mcp/MCPServer.ts

interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  handler: (input: unknown) => Promise<unknown>;
}

class MCPIntegrationServer {
  private tools: Map<string, MCPTool> = new Map();

  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
  }

  async execute(toolName: string, input: unknown): Promise<unknown> {
    const tool = this.tools.get(toolName);
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    // Validate input against schema
    validateSchema(input, tool.inputSchema);

    // Execute tool
    return await tool.handler(input);
  }

  getToolManifest(): MCPToolManifest {
    return {
      tools: Array.from(this.tools.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  }
}
```

**Week 3-4: MCP Adapter Conversion**
```typescript
// Convert GmailAdapter to MCP server
class GmailMCPServer extends MCPIntegrationServer {
  constructor() {
    super();

    // Register tools
    this.registerTool({
      name: 'get_recent_emails',
      description: 'Fetch recent emails from Gmail',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 },
        },
      },
      handler: async (input) => {
        const { limit } = input as { limit: number };
        // Gmail API call
      },
    });

    this.registerTool({
      name: 'summarize_email',
      description: 'Summarize email using AI',
      inputSchema: {
        type: 'object',
        properties: {
          emailId: { type: 'string' },
        },
        required: ['emailId'],
      },
      handler: async (input) => {
        // Summarization logic
      },
    });
  }
}
```

**Week 5-6: MCP Bridge Layer**
```typescript
// Bridge between Port Architecture and MCP
class MCPPortBridge<T extends IntegrationPort> {
  constructor(
    private mcpServer: MCPIntegrationServer,
    private portInterface: T
  ) {}

  async call(method: keyof T, ...args: unknown[]): Promise<unknown> {
    // Map port method to MCP tool
    const toolName = this.mapMethodToTool(method as string);
    const input = this.mapArgsToInput(args);

    return await this.mcpServer.execute(toolName, input);
  }
}
```

**Decision Criteria:**
- ✅ If integration count >20 → Migrate to MCP
- ✅ If third-party developer interest → Enable MCP
- ❌ If 10-15 integrations sufficient → Stay with Port Architecture

---

### Phase 3: Scale (Month 6-12) - **Integration Marketplace**

**Goal:** Third-party developer ecosystem

**Integration Count:** 50-100+ (unlimited with marketplace)

**If MCP adopted in Phase 2:**

**Month 1-2: Developer Portal**
- Developer documentation
- MCP server template/boilerplate
- Local testing tools
- Submission guidelines

**Month 3-4: Marketplace Infrastructure**
- Integration registry (database)
- Runtime integration loading
- Sandboxing & security
- Integration approval workflow

**Month 5-6: Marketplace Launch**
- User-installable integrations
- Integration search & discovery
- OAuth flow for third-party integrations
- Revenue share model (30/70 split)

**Example: Third-party Developer Flow**
```typescript
// Developer writes MCP server
class TodoistMCPServer extends MCPIntegrationServer {
  constructor() {
    super();
    this.registerTool({
      name: 'create_todoist_task',
      description: 'Create task in Todoist',
      inputSchema: { /* ... */ },
      handler: async (input) => {
        // Todoist API call
      },
    });
  }
}

// Developer submits to marketplace
await marketplace.submit({
  name: 'Todoist Integration',
  description: 'Sync tasks with Todoist',
  mcpServer: TodoistMCPServer,
  icon: 'todoist-icon.png',
  requiredScopes: ['todoist:tasks:read', 'todoist:tasks:write'],
});

// YBIS approves & publishes
// Users install via marketplace
// Runtime loading:
const todoistServer = await integrationHub.loadFromMarketplace('todoist');
```

---

## 🎯 Integration Count Roadmap

| Phase | Timeframe | Integration Count | Strategy | Third-party |
|-------|-----------|------------------|----------|-------------|
| **Closed Beta** | Week 1-6 | 3 | Port Architecture | ❌ No |
| **Open Beta** | Week 7-14 | 7 | Port + Hub | ❌ No |
| **MVP** | Month 3-6 | 15-20 | Port or MCP (decision) | ⚠️ Pilot |
| **Scale** | Month 6-12 | 50-100+ | MCP + Marketplace | ✅ Yes |

---

## 🔀 MCP Migration Path (if adopted)

### Step 1: Wrapper Layer (Non-breaking)
```typescript
// Existing Port Architecture continues to work
class EmailIntegrationWrapper implements EmailIntegrationPort {
  constructor(private mcpServer: MCPIntegrationServer) {}

  async getRecentEmails(limit: number): Promise<Email[]> {
    return await this.mcpServer.execute('get_recent_emails', { limit });
  }
}
```

### Step 2: Dual Support (Transition period)
- Existing integrations: Port Architecture
- New integrations: MCP
- Both work via IntegrationHub

### Step 3: Full Migration (Long-term)
- All integrations converted to MCP
- Remove Port Architecture wrapper
- Pure MCP ecosystem

**Migration Time:** 3-6 months (gradual, non-breaking)

---

## ✅ Best Practices

1. **Always use ports, never direct API calls**
2. **Test with NoOp adapters in development**
3. **Implement circuit breaker for flaky services**
4. **Cache aggressively, invalidate smartly**
5. **Provide offline mode for all features**
6. **Log all integration errors with context**
7. **Monitor quota usage proactively**
8. **Document OAuth scopes clearly to users**

---

**Status:** ✅ STRATEGY READY
**Next Step:** Implement IntegrationHub base (Week 3 Closed Beta)
**Version:** 1.0.0
