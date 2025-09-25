# BMAD-YBIS Integration Guide
**YBIS Constitutional Development with BMAD Methodology**
**Version**: 1.0.0
**Date**: 2025-09-24

## Overview

Bu rehber BMAD Method'u YBIS projesinin Constitutional Quality Standards'ı ile entegre etme sürecini detaylandırır. BMAD'in structured agent approach'u ile YBIS'in Zero Workaround Policy'sini birleştirerek ideal development workflow'u oluşturur.

## Core Integration Principles

### 1. Constitutional Compliance at Every Step
BMAD'in her agent'ı ve workflow'u YBIS Constitution v2.0.0 standartlarını enforce eder:
- **Zero Workaround Policy**: Her story implementation constitutional compliance check'i geçer
- **Clean Code Architecture**: 50-line function limit, 3-level if-else max
- **Quality Gate Enforcement**: Pre-commit hooks + CI integration
- **Pattern Consistency**: Single pattern per domain

### 2. BMAD-YBIS Agent Mapping
```
BMAD Agent          → YBIS Integration           → Constitutional Focus
────────────────────────────────────────────────────────────────────
@bmad-master       → General tasks               → All constitutional rules
@architect         → System design              → Configuration Correctness
@pm                → Feature planning           → Pattern Consistency
@dev               → Code implementation        → Clean Code Architecture
@qa                → Quality assurance          → Test Coverage Gates
@sm                → Story management           → Refactoring Discipline
```

## Practical Workflow Integration

### Phase 1: Constitutional Planning (Web UI or IDE)

#### 1.1 Architecture Planning with Constitutional Rules
```bash
# BMAD Command
@architect

# Constitutional Integration
*create-doc architecture

# YBIS Specific Prompts:
"Create TypeScript monorepo architecture following YBIS Constitution v2.0.0:
- NPM Workspaces foundation + selective NX integration
- Zero workaround policy enforcement
- Clean code architecture standards
- Quality gate integration points"
```

**Output Location**: `docs/architecture.md`
**Constitutional Validation**: Architecture must include quality gates, dependency rules

#### 1.2 Product Requirements with Quality Standards
```bash
# BMAD Command
@pm

# Constitutional Integration
*create-doc prd

# YBIS Specific Context:
"Generate PRD aligned with YBIS constitutional development:
- Each epic must include quality gate requirements
- Stories must specify clean code compliance
- Testing requirements per constitutional standards
- Integration with GitHub branching strategy"
```

**Output Location**: `docs/prd.md`
**Constitutional Validation**: Every story includes compliance checklist

### Phase 2: Constitutional Development (IDE Only)

#### 2.1 Document Sharding for Constitutional Context
```bash
# BMAD Command
@po

# Shard documents with constitutional context
*shard-doc docs/prd.md prd
*shard-doc docs/architecture.md architecture

# Creates:
docs/prd/epic-1-core-setup.md          # Constitutional setup requirements
docs/prd/epic-2-feature-impl.md        # Feature with quality gates
docs/architecture/system-design.md      # Core architecture
docs/architecture/quality-standards.md  # Integration points
```

#### 2.2 Constitutional Story Creation
```bash
# BMAD Command (New Chat)
@sm

# Constitutional Story Generation
*create

# SM Agent automatically:
# 1. Reads sharded PRD epics
# 2. Creates story with constitutional compliance built-in
# 3. Adds quality checkpoints to acceptance criteria
# 4. Includes pre-commit validation requirements
```

**Story Template Integration**:
```markdown
## Constitutional Compliance Checklist
- [ ] Functions under 50 lines
- [ ] If-else depth ≤ 3 levels
- [ ] No magic numbers/strings
- [ ] Dependency injection for testability
- [ ] Error handling with specific types
- [ ] Unit tests with 80%+ coverage
- [ ] Pre-commit hooks passing
```

#### 2.3 Constitutional Implementation
```bash
# BMAD Command (New Chat)
@dev

# Implementation with Constitutional Rules
"Implement story following YBIS Constitution v2.0.0"

# Dev Agent automatically:
# 1. Loads constitutional standards from .specify/quality/
# 2. Implements with clean code principles
# 3. Adds constitutional validation to code
# 4. Updates File List with constitutional compliance notes
```

**Code Generation Integration**:
```typescript
// Dev agent creates code with constitutional compliance built-in
export const MAX_RETRY_ATTEMPTS = 3; // No magic numbers
export const API_TIMEOUT_MS = 5000;

export class UserService {
  // Dependency injection for testability
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  // Function under 50 lines, specific error handling
  async createUser(userData: CreateUserRequest): Promise<Result<User, ValidationError>> {
    // Constitutional validation: No workarounds, proper error handling
    const validationResult = this.validateUserData(userData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error };
    }

    try {
      const user = await this.userRepository.save(userData);
      this.logger.info('User created successfully', { userId: user.id });
      return { success: true, data: user };
    } catch (error) {
      // No generic catch-all - specific error types
      if (error instanceof DatabaseError) {
        return { success: false, error: new UserCreationError('Database error', error) };
      }
      throw error; // Re-throw unexpected errors
    }
  }
}
```

#### 2.4 Constitutional Quality Assurance
```bash
# BMAD Command (New Chat)
@qa

# Constitutional Review Process
*review-story

# QA Agent automatically:
# 1. Validates constitutional compliance
# 2. Checks quality gate requirements
# 3. Runs constitutional validation scripts
# 4. Provides refactoring recommendations
# 5. Ensures test coverage meets standards
```

## Command Reference & Code Locations

### BMAD Commands and Their YBIS Outputs

| BMAD Command | Agent | Output Location | Constitutional Integration |
|--------------|-------|-----------------|---------------------------|
| `@architect *create-doc architecture` | architect | `docs/architecture.md` | Configuration correctness, build paths |
| `@pm *create-doc prd` | pm | `docs/prd.md` | Pattern consistency, story quality gates |
| `@po *shard-doc docs/prd.md prd` | po | `docs/prd/epic-*.md` | Sharded with constitutional context |
| `@sm *create` | sm | `docs/stories/story-*.md` | Stories with compliance checklists |
| `@dev` (implement story) | dev | `src/`, `tests/` | Code with constitutional standards |
| `@qa *review-story` | qa | Story updates | Constitutional compliance validation |

### File Structure After Integration

```
YBIS/
├── .specify/
│   ├── memory/constitution.md               # Constitutional rules
│   └── quality/standards-*.md               # Quality standards
├── .bmad-core/                              # BMAD agents and workflows
├── docs/
│   ├── prd.md                              # Generated by @pm
│   ├── architecture.md                     # Generated by @architect
│   ├── prd/epic-*.md                       # Sharded by @po
│   ├── architecture/                       # Sharded architecture
│   └── stories/story-*.md                  # Generated by @sm
├── src/                                    # Generated by @dev
│   ├── types/                              # TypeScript types
│   ├── services/                           # Business logic (constitutional)
│   ├── utils/                              # Pure functions
│   └── constants/                          # No magic numbers
└── tests/                                  # Generated by @dev
    ├── unit/                               # 80%+ coverage required
    ├── integration/                        # API contract tests
    └── __mocks__/                          # Test doubles
```

## Quality Gate Integration Points

### 1. Pre-Development Validation
```bash
# Before any @dev work starts
npm run typecheck      # Constitutional: Configuration correctness
npm run lint           # Constitutional: Clean code architecture
npm run test           # Constitutional: Test coverage gates
```

### 2. BMAD Agent Integration with Git Hooks
```bash
# .git/hooks/pre-commit (integrated with BMAD workflow)
#!/bin/sh
# Constitutional compliance before any commit

# Run BMAD constitutional checks
echo "🔍 Running Constitutional Compliance Checks..."

# 1. TypeScript validation
npm run typecheck || exit 1

# 2. Code quality validation
npm run lint || exit 1

# 3. Test coverage validation
npm run test:coverage || exit 1

# 4. BMAD story status check
node .bmad-core/utils/check-story-status.js || exit 1

echo "✅ Constitutional compliance verified"
```

### 3. BMAD-GitHub Integration
```yaml
# .github/workflows/bmad-constitutional-gates.yml
name: BMAD Constitutional Quality Gates
on:
  pull_request:
    branches: [main, master]

jobs:
  constitutional-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # BMAD Story Validation
      - name: Validate BMAD Story Status
        run: |
          # Check that story is marked as "Review" or "Done"
          node .bmad-core/utils/validate-story-completion.js

      # Constitutional Gates
      - name: TypeScript Compliance
        run: npm run typecheck

      - name: Code Quality Compliance
        run: npm run lint

      - name: Test Coverage Compliance
        run: |
          npm run test:coverage
          # Enforce 80% minimum coverage

      # BMAD QA Integration
      - name: BMAD QA Report
        run: |
          # Generate QA report for the story
          node .bmad-core/utils/generate-qa-report.js
```

## Workflow Examples

### Example 1: New Feature Development
```bash
# 1. Planning Phase (Web UI or IDE)
@pm *create-doc prd
# Specify: "Add user authentication with constitutional compliance"
# Output: docs/prd.md with constitutional requirements

# 2. Architecture Phase
@architect *create-doc architecture
# Context: docs/prd.md + YBIS constitutional requirements
# Output: docs/architecture.md with quality gates

# 3. Document Sharding (IDE)
@po *shard-doc docs/prd.md prd
# Output: docs/prd/epic-1-user-auth.md

# 4. Story Creation (IDE, New Chat)
@sm *create
# Output: docs/stories/story-1-1-user-registration.md
# Includes constitutional compliance checklist

# 5. Implementation (IDE, New Chat)
@dev
# Input: "Implement story-1-1-user-registration.md"
# Output: src/services/auth.service.ts (constitutional compliant)
#         tests/unit/auth.service.test.ts (80%+ coverage)

# 6. Quality Review (IDE, New Chat)
@qa *review-story
# Input: story-1-1-user-registration.md
# Validates constitutional compliance, updates story status
```

### Example 2: Brownfield Enhancement
```bash
# 1. Document Existing System (Web UI - Upload YBIS codebase)
@analyst *document-project
# Output: comprehensive docs with constitutional analysis

# 2. Enhancement Planning
@pm *create-doc brownfield-prd
# Context: existing system + constitutional requirements
# Output: docs/prd.md with integration strategy

# 3. Follow standard workflow with brownfield awareness
# All agents understand existing constitutional violations
# and create migration path to compliance
```

## Constitutional Enforcement Mechanisms

### 1. Automated Story Validation
```javascript
// .bmad-core/utils/constitutional-validator.js
class ConstitutionalValidator {
  validateStory(story) {
    const violations = [];

    // Check for constitutional compliance checklist
    if (!story.includes('Constitutional Compliance Checklist')) {
      violations.push('Missing constitutional compliance checklist');
    }

    // Check for quality gate requirements
    if (!story.includes('Quality Gates')) {
      violations.push('Missing quality gate specifications');
    }

    return violations;
  }

  validateImplementation(files) {
    const violations = [];

    for (const file of files) {
      // Check function length
      const functions = this.extractFunctions(file.content);
      for (const func of functions) {
        if (func.lineCount > 50) {
          violations.push(`Function ${func.name} exceeds 50 lines: ${func.lineCount}`);
        }
      }

      // Check if-else depth
      const maxDepth = this.calculateIfElseDepth(file.content);
      if (maxDepth > 3) {
        violations.push(`If-else depth exceeds 3 levels: ${maxDepth}`);
      }
    }

    return violations;
  }
}
```

### 2. BMAD Agent Constitutional Context
```markdown
<!-- Example: Enhanced @dev agent context -->
# Constitutional Development Context

You are implementing code following YBIS Constitution v2.0.0:

## Non-Negotiable Rules:
- Functions max 50 lines
- If-else depth max 3 levels
- No magic numbers/strings
- Specific error types only
- Dependency injection required
- 80%+ test coverage

## Quality Standards Location:
- .specify/quality/standards-typescript-project-2025-09-24.md
- .specify/quality/standards-github-branching-2025-09-24.md

## Pre-Implementation Checklist:
- [ ] Read story's constitutional compliance requirements
- [ ] Verify architecture alignment
- [ ] Plan code structure following SOLID principles
- [ ] Design error handling strategy
- [ ] Plan test coverage approach
```

## Advanced Integration Features

### 1. Constitutional Story Templates
BMAD SM agent'ı constitutional story template'lerini otomatik kullanır:

```markdown
# Story Template Enhancement
## Constitutional Compliance Section (Auto-added by @sm)

### Quality Gates Required:
- [ ] ESLint passing with zero warnings
- [ ] TypeScript compilation without errors
- [ ] Unit tests achieving 80%+ coverage
- [ ] Integration tests for API endpoints
- [ ] Pre-commit hooks passing

### Code Quality Requirements:
- [ ] All functions under 50 lines
- [ ] No if-else chains over 3 levels
- [ ] All magic numbers extracted to constants
- [ ] Error handling with specific error types
- [ ] Dependency injection implemented where applicable

### Review Checklist:
- [ ] Code follows SOLID principles
- [ ] No workarounds or TODO without tickets
- [ ] Documentation updated if necessary
- [ ] Migration path documented if breaking changes
```

### 2. Intelligent Quality Feedback Loop
```bash
# BMAD QA agent constitutional integration
@qa *review-story

# Enhanced QA Process:
# 1. Runs constitutional validation scripts
# 2. Checks against quality standards
# 3. Provides specific refactoring guidance
# 4. Updates story with compliance status
# 5. Creates follow-up tasks if violations found
```

## Benefits of BMAD-YBIS Integration

### 1. Systematic Quality Enforcement
- Her story constitutional compliance ile başlar
- Otomatik quality gate entegrasyonu
- Systematic refactoring discipline

### 2. Developer Experience
- Clear constitutional guidelines in every story
- Automated compliance checking
- Consistent code quality across team

### 3. Project Scalability
- Constitutional rules scale with project growth
- BMAD workflow ensures consistency
- Quality debt prevention from day one

### 4. AI-Human Collaboration Optimization
- AI agents understand constitutional context
- Human oversight on constitutional compliance
- Structured feedback loop for continuous improvement

## Getting Started Checklist

- [ ] BMAD Core installed (✅ Done)
- [ ] YBIS Constitution v2.0.0 active (✅ Done)
- [ ] Quality standards generated (✅ Done)
- [ ] GitHub branching standards applied (✅ Done)
- [ ] Pre-commit hooks configured
- [ ] CI/CD pipeline with constitutional gates
- [ ] Team training on BMAD-YBIS workflow

## Next Steps

1. **Configure Pre-commit Hooks**: Integrate constitutional validation
2. **Setup CI/CD Pipeline**: Add constitutional quality gates
3. **Team Training**: Share this integration guide
4. **First Story**: Use BMAD workflow with constitutional compliance
5. **Iterate and Improve**: Refine integration based on experience

---

**Integration Status**: ✅ Ready for Implementation
**Constitutional Compliance**: v2.0.0
**BMAD Compatibility**: Full Integration
**Last Updated**: 2025-09-24