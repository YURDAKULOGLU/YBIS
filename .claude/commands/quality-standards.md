---
description: Generate architectural guardrails and quality standards
---

Generate or update architectural quality standards based on your chosen pattern and current project context.

**Purpose**: Establish clear, enforceable rules that prevent technical debt and maintain code quality as the project scales.

## Command Usage

`/quality-standards [pattern]`

**Pattern Options**:
- `clean-architecture` - Clean Architecture with dependency inversion
- `modular-monolith` - Modular monolith with bounded contexts
- `microservices` - Microservices with API-first design
- `library-first` - Library-first development approach
- `auto-detect` - Analyze current codebase and suggest best pattern

## What This Command Does

1. **Pattern Analysis**:
   - Analyze current codebase structure and dependencies
   - Identify existing architectural patterns and violations
   - Recommend the most suitable pattern for your project

2. **Standards Generation**:
   - Create specific, enforceable rules for chosen pattern
   - Define file organization and naming conventions
   - Establish dependency and import rules

3. **Quality Gates**:
   - Set up automated checks and validation rules
   - Define complexity thresholds and limits
   - Create guidelines for code reviews

4. **Documentation**:
   - Generate comprehensive standards document
   - Create quick reference guides for developers
   - Update session context with active standards

## Generated Output

Creates `.specify/quality/standards-[pattern]-[date].md` containing:

### Code Organization Rules
- Directory structure requirements
- File naming conventions
- Module boundary definitions

### Dependency Management
- Allowed and forbidden dependencies
- Import/export patterns
- Circular dependency prevention

### Complexity Limits
- Maximum file line counts
- Function complexity thresholds
- Module coupling metrics

### Testing Requirements
- Test coverage minimums
- Test organization patterns
- Integration test requirements

### Review Checklist
- Automated validation rules
- Manual review criteria
- Quality gate definitions

## Integration with Development Workflow

The generated standards integrate with:
- `/quick-fix` - Validates changes against standards
- `/deep-decision` - Uses standards for architectural choices
- Existing linting and CI/CD pipelines
- Code review processes

## Example Usage

```bash
# Auto-detect best pattern for current codebase
/quality-standards auto-detect

# Use specific clean architecture pattern
/quality-standards clean-architecture

# Generate standards for modular monolith
/quality-standards modular-monolith
```

## Continuous Improvement

Standards evolve with your project:
- Regular reviews and updates
- Pattern migration support
- Exception handling and documentation
- Team feedback integration

Run this command when:
- Starting a new project phase
- Making significant architectural changes
- Onboarding new team members
- Addressing technical debt issues