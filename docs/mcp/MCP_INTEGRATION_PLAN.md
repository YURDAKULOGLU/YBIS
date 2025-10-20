# MCP Integration Plan

**Version:** 1.0  
**Last Updated:** 2025-10-19  
**Status:** Research Phase - Open Beta Implementation  
**Timeline:** Week 11-12 (Open Beta)  
**Related:** [RAG_ARCHITECTURE.md](./rag/RAG_ARCHITECTURE.md)

---

## 🎯 Overview

MCP (Model Context Protocol) integration enables YBIS to connect with external services through a standardized protocol, allowing AI agents to access Google Calendar, Gmail, Notion, Slack, and other services seamlessly.

**Strategic Value:** MCP provides a future-proof way to integrate with external services without building custom adapters for each provider.

---

## 📋 MCP Research Summary

### What is MCP?

MCP is a protocol that enables AI applications to connect to external data sources and tools through a standardized interface. It provides:

- **Standardized Tool Interface:** Consistent API across all providers
- **Resource Discovery:** Automatic detection of available tools/resources
- **Prompt Templates:** Pre-built prompts for common use cases
- **Security Model:** Granular permissions and access control

### Key Benefits for YBIS

1. **Reduced Integration Complexity:** No need to build custom adapters for each service
2. **Future-Proof:** New services can be added without code changes
3. **AI Agent Compatibility:** Works with ChatGPT, Claude, Gemini, and other AI platforms
4. **Standardized Security:** Consistent permission model across services

---

## 🏗️ Integration Architecture

### Current vs Future Architecture

#### Current (Port Architecture)
```typescript
// Custom adapters for each service
class GoogleCalendarAdapter implements CalendarPort {
  // Custom implementation
}

class GmailAdapter implements EmailPort {
  // Custom implementation
}

class NotionAdapter implements NotesPort {
  // Custom implementation
}
```

#### Future (MCP Integration)
```typescript
// MCP client connects to MCP servers
class MCPClient {
  async connectToServer(serverUrl: string): Promise<MCPServer> {
    // Standard MCP protocol
  }
}

// Each service runs as MCP server
const googleCalendarServer = await mcpClient.connectToServer('mcp://google-calendar');
const gmailServer = await mcpClient.connectToServer('mcp://gmail');
const notionServer = await mcpClient.connectToServer('mcp://notion');
```

### Hybrid Approach (Recommended)

```typescript
// Keep existing Port Architecture for core services
class HybridRAGPort implements RAGPort {
  constructor(
    private internalRAG: SupabaseRAGAdapter,  // Internal data
    private mcpClient: MCPClient              // External services
  ) {}

  async selectContext(query: string, sources: RAGSource[]): Promise<RAGContext> {
    const internalResults = await this.internalRAG.selectContext(query, sources);
    
    // Add external context via MCP
    const externalResults = await this.getExternalContext(query, sources);
    
    return this.combineContexts(internalResults, externalResults);
  }

  private async getExternalContext(query: string, sources: RAGSource[]) {
    const externalDocs: RAGResult[] = [];
    
    for (const source of sources) {
      switch (source) {
        case 'calendar':
          const calendarServer = await this.mcpClient.connectToServer('mcp://google-calendar');
          const events = await calendarServer.listEvents();
          externalDocs.push(...this.convertToRAGResults(events));
          break;
          
        case 'email':
          const gmailServer = await this.mcpClient.connectToServer('mcp://gmail');
          const emails = await gmailServer.searchEmails(query);
          externalDocs.push(...this.convertToRAGResults(emails));
          break;
      }
    }
    
    return externalDocs;
  }
}
```

---

## 📅 Implementation Timeline

### Week 11-12: MCP Integration (Open Beta)

#### Day 1-2: MCP Client Implementation
```typescript
// packages/@ybis/mcp/
├── src/
│   ├── client/
│   │   └── MCPClient.ts           # MCP protocol client
│   ├── servers/
│   │   ├── GoogleCalendarServer.ts
│   │   ├── GmailServer.ts
│   │   └── NotionServer.ts
│   └── types/
│       ├── MCPTool.ts
│       ├── MCPResource.ts
│       └── MCPPrompt.ts
```

#### Day 3-4: Service Integration
- Google Calendar MCP server setup
- Gmail MCP server setup
- Notion MCP server setup
- Hybrid RAG integration

#### Day 5: Testing + Documentation
- MCP integration tests
- Performance testing
- Documentation updates

### Week 13+: Advanced MCP Features

#### Additional Services
- Slack integration
- GitHub integration
- Trello integration
- Custom MCP servers

#### Advanced Features
- MCP server discovery
- Dynamic tool registration
- Cross-service workflows
- MCP marketplace integration

---

## 🔧 Technical Implementation

### MCP Client Implementation

```typescript
// packages/@ybis/mcp/src/client/MCPClient.ts
export class MCPClient {
  private servers: Map<string, MCPServer> = new Map();

  async connectToServer(serverUrl: string): Promise<MCPServer> {
    const server = new MCPServer(serverUrl);
    await server.connect();
    this.servers.set(serverUrl, server);
    return server;
  }

  async listAvailableTools(): Promise<MCPTool[]> {
    const tools: MCPTool[] = [];
    
    for (const server of this.servers.values()) {
      const serverTools = await server.listTools();
      tools.push(...serverTools);
    }
    
    return tools;
  }

  async executeTool(toolName: string, parameters: any): Promise<any> {
    for (const server of this.servers.values()) {
      if (await server.hasTool(toolName)) {
        return await server.executeTool(toolName, parameters);
      }
    }
    
    throw new Error(`Tool ${toolName} not found`);
  }
}
```

### Google Calendar MCP Server

```typescript
// packages/@ybis/mcp/src/servers/GoogleCalendarServer.ts
export class GoogleCalendarServer implements MCPServer {
  constructor(private calendar: GoogleCalendarAPI) {}

  async listTools(): Promise<MCPTool[]> {
    return [
      {
        name: 'list_events',
        description: 'List calendar events',
        parameters: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            calendarId: { type: 'string' }
          }
        }
      },
      {
        name: 'create_event',
        description: 'Create a new calendar event',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            description: { type: 'string' }
          }
        }
      }
    ];
  }

  async executeTool(toolName: string, parameters: any): Promise<any> {
    switch (toolName) {
      case 'list_events':
        return await this.calendar.listEvents(parameters);
      case 'create_event':
        return await this.calendar.createEvent(parameters);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
```

### Hybrid RAG Integration

```typescript
// packages/@ybis/rag/src/adapters/HybridRAGAdapter.ts
export class HybridRAGAdapter implements RAGPort {
  constructor(
    private internalRAG: SupabaseRAGAdapter,
    private mcpClient: MCPClient
  ) {}

  async selectContext(query: string, sources: RAGSource[]): Promise<RAGContext> {
    // Get internal context (notes, tasks, etc.)
    const internalContext = await this.internalRAG.selectContext(query, sources);
    
    // Get external context via MCP
    const externalContext = await this.getExternalContext(query, sources);
    
    // Combine and rank results
    const combinedResults = this.combineAndRankResults(
      internalContext.documents,
      externalContext
    );
    
    return {
      documents: combinedResults,
      totalFound: combinedResults.length,
      query,
      sources: {
        internal: internalContext.documents.length,
        external: externalContext.length
      }
    };
  }

  private async getExternalContext(query: string, sources: RAGSource[]): Promise<RAGResult[]> {
    const externalResults: RAGResult[] = [];
    
    for (const source of sources) {
      try {
        switch (source) {
          case 'calendar':
            const calendarServer = await this.mcpClient.connectToServer('mcp://google-calendar');
            const events = await calendarServer.executeTool('list_events', {
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              endDate: new Date()
            });
            
            externalResults.push(...this.convertEventsToRAGResults(events));
            break;
            
          case 'email':
            const gmailServer = await this.mcpClient.connectToServer('mcp://gmail');
            const emails = await gmailServer.executeTool('search_emails', {
              query: query,
              maxResults: 10
            });
            
            externalResults.push(...this.convertEmailsToRAGResults(emails));
            break;
        }
      } catch (error) {
        console.warn(`Failed to get external context for ${source}:`, error);
        // Continue with other sources
      }
    }
    
    return externalResults;
  }
}
```

---

## 🔒 Security & Permissions

### MCP Security Model

```typescript
// MCP server permissions
interface MCPServerPermissions {
  tools: string[];           // Allowed tools
  resources: string[];       // Allowed resources
  prompts: string[];        // Allowed prompts
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

// Example: Google Calendar permissions
const googleCalendarPermissions: MCPServerPermissions = {
  tools: ['list_events', 'create_event', 'update_event'],
  resources: ['calendars', 'events'],
  prompts: ['schedule_meeting', 'find_free_time'],
  rateLimits: {
    requestsPerMinute: 100,
    requestsPerHour: 1000
  }
};
```

### User Consent Flow

```typescript
// MCP server authorization
class MCPServerAuth {
  async requestPermission(
    serverUrl: string,
    permissions: MCPServerPermissions
  ): Promise<boolean> {
    // Show user permission dialog
    const userConsent = await this.showPermissionDialog(serverUrl, permissions);
    
    if (userConsent) {
      // Store permission token
      await this.storePermissionToken(serverUrl, permissions);
      return true;
    }
    
    return false;
  }
}
```

---

## 📊 Cost Analysis

### MCP Integration Costs

| Service | MCP Server Cost | API Calls/Month | Cost/Month |
|---------|----------------|-----------------|------------|
| **Google Calendar** | Free | 10K | $0 |
| **Gmail** | Free | 5K | $0 |
| **Notion** | Free | 2K | $0 |
| **Slack** | Free | 1K | $0 |
| **GitHub** | Free | 500 | $0 |
| **Total** | **Free** | **18.5K** | **$0** |

### Infrastructure Costs

| Component | Cost/Month | Notes |
|-----------|-----------|-------|
| **MCP Client** | $0 | Pure TypeScript |
| **MCP Servers** | $0 | Local implementation |
| **External APIs** | $0 | Within free tiers |
| **Total** | **$0** | **No additional cost!** |

---

## 🎯 Success Metrics

### Week 11-12 (MCP Integration)

- ✅ MCP client operational
- ✅ Google Calendar integration working
- ✅ Gmail integration working
- ✅ Hybrid RAG context selection
- ✅ Zero additional cost
- ✅ User feedback: "AI now knows my external data!"

### Week 13+ (Advanced Features)

- ✅ 5+ external services integrated
- ✅ Cross-service workflows working
- ✅ MCP server discovery operational
- ✅ Dynamic tool registration
- ✅ User satisfaction > 4.5/5.0

---

## 🔄 Migration Strategy

### Phase 1: Hybrid Approach (Week 11-12)

```typescript
// Keep existing Port Architecture + Add MCP
const internalRAG = new SupabaseRAGAdapter(supabase, embedder);
const mcpClient = new MCPClient();
const hybridRAG = new HybridRAGAdapter(internalRAG, mcpClient);

// App code unchanged - just swap adapter!
const rag = hybridRAG;
```

### Phase 2: Full MCP Migration (Future)

```typescript
// Complete MCP migration (if beneficial)
const mcpRAG = new MCPRAGAdapter(mcpClient);
const rag = mcpRAG;
```

**Decision Point:** Evaluate MCP benefits after 2 months of hybrid usage.

---

## 📚 Related Documentation

- [RAG_ARCHITECTURE.md](./rag/RAG_ARCHITECTURE.md) - Overall RAG architecture
- [TIER_EVOLUTION.md](./rag/TIER_EVOLUTION.md) - RAG tier progression
- [DEVELOPMENT_LOG.md](../Güncel/DEVELOPMENT_LOG.md#AD-034) - Architecture decision
- [PRODUCT_ROADMAP.md](../roadmap/PRODUCT_ROADMAP.md) - Timeline alignment

---

## 🔗 External Resources

- [MCP Specification](https://modelcontextprotocol.io/) - Official MCP documentation
- [MCP Examples](https://github.com/modelcontextprotocol/examples) - Sample implementations
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Community servers

---

**Maintained By:** YBIS AI System  
**Next Review:** Week 11 (MCP implementation start)
