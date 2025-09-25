# YBIS GitHub Branching Strategy Standards
**Generated**: 2025-09-24
**Pattern**: Feature Branch Workflow with Constitutional Compliance
**Constitution**: v2.0.0
**Repository**: YURDAKULOGLU/YBIS

## Current Repository Analysis

**Main Branches**: `main` (primary), `master` (legacy)
**Remote**: `origin` (GitHub)
**Current Commits**: 2 (Initial + Constitution)
**Branch Protection**: TBD (to be configured for both branches)

## Constitutional Compliance for Git Workflow

### VIII. Quality Gate Enforcement Integration
- **No Direct Commits**: Master branch requires PR review
- **Automated Validation**: CI checks before merge
- **Code Review Mandate**: All changes need approval

### VI. Zero Workaround Policy for Git
- **No Bypass Commits**: No `--no-verify` or emergency commits
- **Commit Message Standards**: Structured format required
- **Branch Naming**: Consistent patterns only

## Branching Strategy: Feature Branch Workflow

### Core Principle
Dual main branches with `main` as primary development target and `master` for legacy support. Constitutional quality gates prevent problematic merges.

### Branch Types and Naming

#### 1. Primary Branch: `main`
- **Purpose**: Main development branch, production-ready code
- **Protection**: Direct commits forbidden
- **Merge**: Only via approved PRs
- **CI/CD**: Primary deployment target
- **Quality Gate**: All constitutional rules enforced

#### 2. Legacy Branch: `master`
- **Purpose**: Legacy compatibility and parallel maintenance
- **Protection**: Direct commits forbidden
- **Merge**: Only via approved PRs
- **CI/CD**: Legacy deployment target
- **Quality Gate**: All constitutional rules enforced

#### 3. Feature Branches: `feature/[issue-id]-[description]`
- **Format**: `feature/123-user-authentication`
- **Purpose**: New features and enhancements
- **Base**: Always branch from `main` (primary development)
- **Merge**: Via PR to `main`
- **Lifetime**: Delete after merge

#### 4. Hotfix Branches: `hotfix/[issue-id]-[critical-fix]`
- **Format**: `hotfix/456-security-vulnerability`
- **Purpose**: Critical production fixes
- **Base**: From `main` or `master` (depending on target)
- **Merge**: To both `main` and `master` if needed
- **Lifetime**: Delete immediately after merge

#### 5. Release Branches: `release/v[version]`
- **Format**: `release/v1.2.0`
- **Purpose**: Version preparation and stabilization
- **Base**: From `main` when feature-complete
- **Merge**: To both `main` and `master` after validation
- **Lifetime**: Keep for version reference

## Branch Naming Standards

### Valid Patterns
```bash
✅ feature/123-user-login-system
✅ feature/456-payment-integration
✅ hotfix/789-memory-leak-fix
✅ release/v1.0.0
✅ docs/update-readme
✅ refactor/cleanup-auth-service
```

### Forbidden Patterns
```bash
❌ feature/myfeature           # No issue ID
❌ fix-bug                     # Not descriptive
❌ john-work                   # Personal branches
❌ feature/Feature123          # Wrong case
❌ master-backup               # Confusing names
```

### Validation Rules
- **Issue Reference**: All branches must reference issue/ticket number
- **Kebab Case**: Use hyphens, lowercase only
- **Descriptive**: Clear purpose from branch name
- **Max Length**: 50 characters maximum

## Commit Message Standards

### Format Requirements
```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types (Constitutional Compliance)
- **feat**: New feature (aligns with Progressive Enhancement)
- **fix**: Bug fix (supports Zero Workaround Policy)
- **refactor**: Code refactoring (Refactoring Discipline)
- **test**: Adding tests (Test Coverage Gates)
- **docs**: Documentation changes
- **style**: Formatting changes
- **ci**: CI/CD configuration changes

### Examples
```bash
✅ feat(auth): implement user login with JWT tokens

✅ fix(api): resolve memory leak in user service
Fixes issue #123 where continuous requests caused memory growth

✅ refactor(utils): extract string validation to separate module
Reduces complexity and improves testability per constitution

✅ test(auth): add integration tests for login flow
Achieves 85% coverage requirement per constitutional standards

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Forbidden Commit Messages
```bash
❌ fix stuff                   # Not descriptive
❌ WIP                        # Work in progress commits
❌ quick fix                  # Violates workaround policy
❌ forgot this                # Not professional
❌ asdf                       # No meaning
```

## Pull Request Workflow

### PR Creation Requirements
1. **Branch Up-to-Date**: Rebase on latest `master`
2. **CI Passing**: All quality gates green
3. **Description**: Detailed PR template filled
4. **Issue Link**: Reference related issue/ticket
5. **Reviewer Assignment**: At least 1 code reviewer

### PR Template
```markdown
## Summary
Brief description of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (requires version bump)
- [ ] Documentation update
- [ ] Refactoring

## Constitutional Compliance Checklist
- [ ] No workarounds or TODO without tickets
- [ ] Functions under 50 lines
- [ ] If-else depth ≤ 3 levels
- [ ] Tests added/updated for new code
- [ ] Documentation updated if needed

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots/Logs
[If applicable, add screenshots or relevant logs]

## Related Issues
Fixes #(issue)
```

### Review Requirements
- **Code Review**: Minimum 1 approval required
- **Constitutional Check**: Reviewer validates compliance
- **Quality Gates**: All CI checks must pass
- **Breaking Changes**: Senior developer approval needed

## GitHub Branch Protection Rules

### Main Branch Protection (REQUIRED)
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci/typecheck", "ci/lint", "ci/test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

### Master Branch Protection (REQUIRED - Legacy Support)
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci/typecheck", "ci/lint", "ci/test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

### Setup Commands
```bash
# Configure branch protection via GitHub CLI

# Protect main branch
gh api repos/YURDAKULOGLU/YBIS/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/typecheck","ci/lint","ci/test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Protect master branch (legacy)
gh api repos/YURDAKULOGLU/YBIS/branches/master/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/typecheck","ci/lint","ci/test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Git Hooks Integration

### Pre-commit Hook (Local)
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Constitutional compliance checks
npm run typecheck
npm run lint
npm run test --passWithNoTests

# Validate commit follows patterns
if ! grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}" "$1"; then
  echo "❌ Commit message must follow conventional format"
  exit 1
fi
```

### Pre-push Hook (Local)
```bash
#!/bin/sh
# .git/hooks/pre-push

protected_branches='main master'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

for protected_branch in $protected_branches; do
  if [ $protected_branch = $current_branch ]; then
    echo "❌ Direct push to $protected_branch forbidden. Use PR workflow."
    exit 1
  fi
done
```

## CI/CD Integration with Quality Gates

### GitHub Actions Workflow
```yaml
name: Constitutional Quality Gates
on:
  pull_request:
    branches: [main, master]
  push:
    branches: [main, master]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Constitutional Gate: Configuration Correctness
      - name: TypeScript Configuration Check
        run: |
          npm ci
          npm run typecheck

      # Constitutional Gate: Clean Code Architecture
      - name: Lint and Code Quality
        run: |
          npm run lint
          # Check function line limits
          # Check complexity limits

      # Constitutional Gate: Test Coverage
      - name: Test Coverage Validation
        run: |
          npm run test:coverage
          # Enforce 80% minimum coverage

      # Constitutional Gate: Zero Workaround Policy
      - name: Workaround Detection
        run: |
          # Detect TODO without tickets
          # Check if-else depth
          # Validate error handling patterns
```

## Workflow Examples

### Feature Development Flow
```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feature/123-user-authentication

# 2. Develop with commits following standards
git add .
git commit -m "feat(auth): add user registration endpoint

Implements JWT-based authentication system
- Add user model with validation
- Create registration API endpoint
- Add password hashing utility
- Include comprehensive error handling

Refs #123"

# 3. Push and create PR
git push -u origin feature/123-user-authentication
gh pr create --title "feat: User Authentication System" --body-file .github/pr-template.md

# 4. After review approval and CI pass
gh pr merge --squash --delete-branch
```

### Hotfix Flow
```bash
# 1. Critical issue discovered
git checkout main
git pull origin main
git checkout -b hotfix/456-security-vulnerability

# 2. Quick fix with proper commit
git add .
git commit -m "fix(security): patch XSS vulnerability in user input

- Sanitize all user inputs in API endpoints
- Add validation middleware
- Update security tests
- Emergency deployment required

Fixes #456"

# 3. Expedited review and merge
git push -u origin hotfix/456-security-vulnerability
gh pr create --title "HOTFIX: Security Vulnerability Patch" --assignee @security-team
```

## Branch Lifecycle Management

### Automated Cleanup
```bash
# Delete merged branches (weekly automation)
git remote prune origin
git branch --merged main | grep -v -E "(main|master)" | xargs -n 1 git branch -d
git branch --merged master | grep -v -E "(main|master)" | xargs -n 1 git branch -d

# Stale branch detection (monthly)
git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | \
  awk '$2 <= "'$(date -d '30 days ago' '+%Y-%m-%d')'"'
```

### Branch Policies
- **Feature branches**: Delete immediately after merge
- **Release branches**: Keep for 6 months minimum
- **Hotfix branches**: Delete after merge and deployment verification
- **Stale branches**: Auto-delete after 30 days of inactivity

## Quality Metrics and Monitoring

### Branch Health Metrics
- **PR Merge Time**: Target < 2 days
- **CI Success Rate**: Target > 95%
- **Failed PR Rate**: Target < 10%
- **Branch Lifespan**: Feature branches < 1 week

### Constitutional Compliance Tracking
- **Workaround Violations**: 0 tolerance
- **Function Length Violations**: Track and remediate
- **Test Coverage Drops**: Block merge if below 80%
- **Commit Message Standards**: 100% compliance required

## Migration and Setup Tasks

### Immediate Actions Required
1. **Enable Branch Protection**: Configure master branch protection
2. **Setup CI/CD**: Implement GitHub Actions with quality gates
3. **Install Hooks**: Setup pre-commit and pre-push hooks
4. **Team Training**: Share branching standards with all developers

### Configuration Files to Create
- `.github/workflows/quality-gates.yml`
- `.github/pull_request_template.md`
- `.git/hooks/pre-commit`
- `.git/hooks/pre-push`

---

**Standards Version**: 1.0.0
**Last Updated**: 2025-09-24
**Next Review**: 2026-01-24
**Compliance Status**: ✅ Active
**Integration**: Constitutional Quality Gates v2.0.0