---
description: Analyze change impact and provide risk assessment before modifications
---

Analyze the potential impact of proposed changes on the codebase, providing risk levels, affected components, and mitigation strategies.

**Purpose**: Prevent vibe coding disasters by understanding change consequences before implementation.

## Command Usage

`/impact-check [change-description]`

**Example Usage**:
- `/impact-check "Change AuthContext to use Redux"`
- `/impact-check "Move user profile API to GraphQL"`
- `/impact-check "Replace Material-UI with Tailwind"`
- `/impact-check "Refactor database schema for users table"`

## Impact Analysis Process

### 1. Change Scope Analysis
- **File Dependencies**: Which files import/use the target component
- **Function Dependencies**: Which functions call the target function
- **Type Dependencies**: Which types depend on changed interfaces
- **API Dependencies**: Which endpoints/contracts are affected

### 2. Risk Assessment
- **LOW RISK**: <5 usages, isolated component, comprehensive tests
- **MEDIUM RISK**: 5-15 usages, some coupling, partial test coverage
- **HIGH RISK**: >15 usages, core component, missing tests
- **CRITICAL RISK**: Framework changes, database migrations, breaking API changes

### 3. Impact Categories

#### Code Impact
- **Direct Usage**: Files directly importing/calling the changed code
- **Indirect Usage**: Files that depend on direct usage files
- **Type Propagation**: TypeScript type dependencies
- **Build System**: Configuration and build tool effects

#### Test Impact
- **Unit Tests**: Tests that directly test the changed code
- **Integration Tests**: Tests that use the changed code indirectly
- **E2E Tests**: End-to-end scenarios that might be affected
- **Test Data**: Mock data and fixtures requiring updates

#### Runtime Impact
- **Performance**: Potential performance implications
- **Memory**: Memory usage changes
- **API Contracts**: External API compatibility
- **User Experience**: UI/UX behavior changes

### 4. Migration Planning
- **Preparation Steps**: What needs to be done before the change
- **Implementation Order**: Sequence of changes to minimize breakage
- **Rollback Strategy**: How to undo the change if needed
- **Validation Steps**: How to verify the change worked correctly

## Output Format

### Impact Summary
```markdown
## Change Impact Analysis: [CHANGE DESCRIPTION]

**Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]
**Affected Files**: [NUMBER] files
**Test Requirements**: [REQUIREMENTS]
**Estimated Effort**: [TIME ESTIMATE]
```

### Detailed Analysis
```markdown
### Direct Impact (Files that will break immediately)
- path/to/file1.ts (reason: import statement)
- path/to/file2.tsx (reason: prop usage)

### Indirect Impact (Files that might break)
- path/to/file3.ts (reason: type dependency)
- path/to/file4.tsx (reason: context consumer)

### Test Impact
- Missing tests: [list of critical paths without tests]
- Required test updates: [list of tests to modify]
- New tests needed: [list of new test requirements]

### Rollback Plan
1. [Step to undo change]
2. [Step to restore previous state]
3. [Step to verify rollback worked]
```

## Integration with Workflow

Impact checks should be run:
- **Before** major refactoring
- **Before** changing core components
- **Before** API modifications
- **Before** dependency updates
- **After** quality gate failures

## Risk Mitigation Strategies

### For HIGH/CRITICAL Risk Changes
1. **Phase the Change**: Break into smaller, safer steps
2. **Add Tests First**: Ensure comprehensive test coverage
3. **Feature Flags**: Hide changes behind toggles
4. **Gradual Rollout**: Deploy to subset of users first

### For MEDIUM Risk Changes
1. **Increase Test Coverage**: Focus on integration tests
2. **Code Review**: Require additional reviewers
3. **Monitoring**: Add specific metrics for the change

### For LOW Risk Changes
1. **Standard Process**: Normal development workflow
2. **Basic Testing**: Unit tests and smoke tests
3. **Quick Validation**: Manual testing of happy path

## Example Analysis Flow

```bash
# User wants to change state management
/impact-check "Replace React Context with Redux for user state"

# System analyzes:
# - Finds 12 files using UserContext
# - Identifies 3 components without tests
# - Detects type dependencies in 8 files
# - Calculates MEDIUM risk level

# Provides:
# - List of files to update
# - Test requirements
# - Step-by-step migration plan
# - Rollback strategy
```

**Result**: Informed decision making with clear understanding of change consequences and required preparation steps.