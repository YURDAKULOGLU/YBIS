<!--
SYNC IMPACT REPORT:
Version: 1.0.0 → 2.0.0 (MAJOR - New quality enforcement principles added)
Added sections:
- Code Quality Standards (anti-workaround principles)
- Development Workflow (quality gates)
Modified principles: None renamed
Removed sections: None
Templates requiring updates:
✅ .specify/templates/plan-template.md - Constitution Check section aligned
✅ .specify/templates/spec-template.md - No changes needed
✅ .specify/templates/tasks-template.md - No changes needed
Follow-up TODOs: None
-->

# YBIS Constitution
<!-- YBIS Fresh Start Development Constitution -->

## Core Principles

### I. Hybrid Monorepo Foundation
**NPM Workspaces + Selective NX Integration**
Every package must be managed through NPM workspaces first; NX provides orchestration only; Clear tool responsibilities must be maintained; Dependencies aligned across workspace; Build paths point to dist/ never src/

### II. Progressive Enhancement Architecture
**Start Simple, Add Complexity When Justified**
Begin with minimal viable foundation; Add advanced tooling only when clear benefit proven; Each enhancement must be reversible; Document complexity justification; Prefer standard solutions over custom

### III. Configuration Correctness (NON-NEGOTIABLE)
**Zero Tolerance for Config Drift**
All dependencies must maintain version alignment; TypeScript project references required; Metro config must point to compiled output; Pre-commit validation mandatory; Automated dependency drift detection

### IV. Pattern Consistency (ANTI-VIBE-CODING)
**Single Pattern per Domain**
State management: Choose ONE (Context OR Redux); UI components: Choose ONE library; Data fetching: Choose ONE pattern; Error handling: Choose ONE approach; Logging: Choose ONE format; File structure: Choose ONE convention

### V. Test Coverage Gates (NON-NEGOTIABLE)
**Minimum Viable Testing**
New components: Smoke test mandatory; API changes: Contract test required; Critical paths: E2E test coverage; Breaking changes: Migration test needed; Complex logic: Unit test required

## Code Quality Standards

### VI. Zero Workaround Policy (NON-NEGOTIABLE)
**Eliminate Temporary Solutions**
No workarounds, patches, or quick fixes are permitted in codebase; Every TODO must have ticket number and timeline; Temporary code must have expiration date and refactor plan; If-else chains over 3 levels require strategy pattern; All edge cases must have proper error handling, not conditional patches

### VII. Clean Code Architecture (NON-NEGOTIABLE)
**Readable, Maintainable, Testable**
Functions must have single responsibility; Classes must follow SOLID principles; No god objects or functions over 50 lines; Dependency injection required for testability; Magic numbers and strings forbidden - use constants; Complex conditionals must be extracted to named functions

## Development Workflow

### VIII. Quality Gate Enforcement
**Automated Quality Validation**
Pre-commit hooks must enforce linting, formatting, and type checking; CI pipeline must validate tests, coverage, and security; Code reviews must verify architectural compliance; No direct commits to main branch; Feature branches must pass all quality gates before merge

### IX. Refactoring Discipline
**Continuous Code Improvement**
Refactor before adding features to reduce complexity; Boy Scout Rule - leave code better than found; Technical debt must be tracked and prioritized; Legacy code updates require test coverage increase; Performance degradation triggers mandatory optimization sprint

## Governance

**Constitution Authority**: This constitution supersedes all other development practices and coding standards. All technical decisions must align with these principles.

**Amendment Process**: Changes require architectural review, team consensus, and migration plan. Version increments follow semantic versioning based on impact severity.

**Compliance Review**: All pull requests must demonstrate constitutional compliance. Code reviews must verify principle adherence. Quality violations require immediate remediation.

**Quality Enforcement**: Use `/quality-standards` command for architecture validation. Session context must document all architectural decisions. Violations tracked in session-context.md until resolved.

**Version**: 2.0.0 | **Ratified**: 2025-09-24 | **Last Amended**: 2025-09-24

## Extended Spec-Kit Integration

### Session Continuity Workflow
- **Start Every Session**: Use `/session-start` to load previous context and decisions
- **Document Decisions**: Update session-context.md with architectural choices and rationale
- **Quality Validation**: Run `/quality-standards` before making architectural decisions
- **Strategic Planning**: Use `/deep-decision` for choices impacting future phases

### Change Management Discipline
- **Quick Fixes**: Use `/quick-fix` for changes under 20 lines with minimal impact
- **Architectural Changes**: Always validate against quality standards and document rationale
- **Risk Assessment**: Check session context for high-risk areas before modifications
- **Phase Awareness**: Consider current development phase and future transition needs

### AI Tool Coordination
- **Claude**: Complex analysis, architectural decisions, multi-file reasoning
- **Cursor**: Real-time editing, debugging, repository-wide changes
- **Copilot**: Quick fixes, boilerplate, GitHub integration
- **Context Handoff**: Always update session context when switching tools

### Quality Governance
- **Pattern Compliance**: All code must align with established architectural patterns
- **Decision Documentation**: Record rationale for all architectural choices
- **Standards Evolution**: Update quality standards when new patterns emerge
- **Violation Tracking**: Document and address any standard violations immediately