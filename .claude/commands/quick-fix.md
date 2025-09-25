---
description: Handle small changes without full spec cycle
---

Execute small, low-risk changes efficiently without going through the full specification and planning cycle.

**Purpose**: Streamline development for minor fixes, updates, and improvements while maintaining quality standards and documentation.

## Command Usage

`/quick-fix [description]`

**Examples**:
- `/quick-fix Fix typo in user interface text`
- `/quick-fix Update dependency version for security patch`
- `/quick-fix Add missing error handling to API endpoint`
- `/quick-fix Refactor helper function for better readability`

## Qualification Criteria

Use `/quick-fix` for changes that meet ALL criteria:

### Size Limits
- **Lines of Code**: Under 20 lines changed
- **Files Affected**: Maximum 3 files
- **Scope**: Single component or utility

### Risk Assessment
- **Low Impact**: No breaking changes to public APIs
- **Isolated**: Changes don't affect other modules
- **Reversible**: Easy to rollback if issues arise

### Type Categories
- Bug fixes for minor issues
- Documentation updates
- Code formatting and style improvements
- Configuration tweaks
- Dependency updates (patch versions)
- Test additions or improvements

## Quick-Fix Process

1. **Validation Check**:
   - Verify change meets qualification criteria
   - Check against active quality standards
   - Confirm no architectural impact

2. **Immediate Implementation**:
   - Make the requested changes
   - Follow existing code patterns and conventions
   - Maintain consistency with codebase style

3. **Quality Validation**:
   - Run relevant tests to ensure no regressions
   - Validate against coding standards
   - Check for any unintended side effects

4. **Documentation Update**:
   - Update session context with change summary
   - Add entry to recent changes log
   - Update any affected documentation

5. **Completion Summary**:
   - Report what was changed and why
   - Confirm quality standards compliance
   - Note any follow-up actions needed

## When NOT to Use Quick-Fix

Escalate to full spec cycle (`/specify` → `/plan` → `/tasks`) for:

### Complex Changes
- Architectural modifications
- New feature additions
- API contract changes
- Database schema updates

### High-Risk Areas
- Authentication/security systems
- Payment processing
- Data migration scripts
- External service integrations

### Multi-Team Impact
- Changes affecting other teams
- Breaking changes to shared libraries
- Public API modifications
- Infrastructure changes

## Quality Safeguards

Built-in protections ensure quick fixes maintain quality:

- **Automated Validation**: Changes validated against quality standards
- **Pattern Compliance**: Must follow established architectural patterns
- **Test Requirements**: Relevant tests must pass
- **Review Triggers**: Complex changes automatically escalated
- **Rollback Support**: All changes easily reversible

## Integration with Session Context

Quick fixes are tracked and reported:
- Added to session context decision log
- Included in recent changes summary
- Available for future reference
- Supports pattern analysis and improvement

## Example Workflow

```bash
# Request a quick fix
/quick-fix Update error message text for clarity

# System validates change qualifies
# Implements change following standards
# Runs tests and validation
# Updates documentation
# Reports completion
```

**Result**: Change implemented efficiently while maintaining all quality standards and documentation requirements.