# YBIS Git Workflow Guide

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Status:** CANONICAL - Git Strategy

---

## 📋 Branch Strategy

### Main Branches

```
main (master)     ← Production-ready code (protected)
  └─ develop      ← Integration branch (Week milestones)
      └─ feature/* ← Feature development branches
```

**Branch Roles:**
- **main/master:** Production releases only (tagged: v1.0.0, v1.1.0)
- **develop:** Weekly integration (Week 1, Week 2, etc.)
- **feature/*:** Individual features/tasks

---

## 🌿 Branch Naming Convention

```bash
feature/TXXX-short-description    # Tasks from tasks.md
feature/story-1.1-mobile-foundation
feature/ad-024-port-criteria-fix
bugfix/settings-import-error
docs/update-git-workflow
chore/dependencies-update
```

**Examples:**
- `feature/T001-workspace-setup`
- `feature/T015-theme-implementation`
- `bugfix/typescript-errors`
- `docs/port-architecture-clarification`

---

## 💬 Commit Message Convention

### Format (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation only
- **style:** Code style (formatting, no logic change)
- **refactor:** Code refactor (no feat/fix)
- **test:** Adding tests
- **chore:** Build process, dependencies, tooling

### Scope (Optional)

- **mobile:** Mobile app changes
- **backend:** Backend API changes
- **theme:** Theme package changes
- **auth:** Auth package changes
- **core:** Core package changes
- **docs:** Documentation changes

### Examples

```bash
# Good commits
feat(theme): implement multi-theme support with zustand store
fix(mobile): add missing useState import in settings.tsx
docs(constitution): clarify port usage criteria (AD-024)
chore(deps): add zustand and async-storage to theme package

# Bad commits (avoid)
feat: updates
fix: stuff
chore: changes
```

---

## 🔄 Workflow Steps

### 1. Start New Feature

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/T015-theme-implementation
```

### 2. Work & Commit

```bash
# Make changes...

# Stage changes
git add packages/theme/src/stores/useThemeStore.ts
git add packages/theme/src/index.ts
git add apps/mobile/app/_layout.tsx
git add apps/mobile/app/(tabs)/settings.tsx

# Commit with conventional message
git commit -m "feat(theme): implement multi-theme support with zustand

- Create useThemeStore with zustand + AsyncStorage persistence
- Add theme exports to @ybis/theme package
- Connect theme to TamaguiProvider in _layout.tsx
- Fix settings.tsx useState import and use useThemeStore
- Update package.json with zustand dependencies

Architecture:
- No ThemePort (internal logic, not vendor swap - AD-024)
- Build for Scale: Phase 0 ships light/dark, ready for custom themes

Type-check: PASSED (0 errors)
"
```

### 3. Push Feature Branch

```bash
# Push to remote
git push -u origin feature/T015-theme-implementation
```

### 4. Merge to Develop (Weekly Integration)

```bash
# Switch to develop
git checkout develop

# Merge feature (no fast-forward for history)
git merge --no-ff feature/T015-theme-implementation

# Push to remote
git push origin develop
```

### 5. Release to Main (Phase Completion)

```bash
# Switch to main
git checkout main

# Merge develop
git merge --no-ff develop

# Tag release
git tag -a v0.1.0 -m "Phase 0: Closed Beta - Week 1 Complete"

# Push with tags
git push origin main --tags
```

---

## 🚫 Protected Branch Rules

### Main Branch (Production)

- ❌ No direct commits
- ✅ Only merge from develop
- ✅ Require PR review (future)
- ✅ Must pass CI/CD (future)
- ✅ Tagged releases only

### Develop Branch (Integration)

- ❌ No direct commits
- ✅ Only merge from feature branches
- ✅ Weekly integration point

---

## 📦 Commit Checklist

Before committing:

- [ ] Run `pnpm run type-check` (zero errors)
- [ ] Run `pnpm run lint` (zero warnings)
- [ ] Run `pnpm run test` (when tests exist)
- [ ] Update DEVELOPMENT_LOG.md (if architecture decision)

- [ ] Commit message follows convention
- [ ] Staged files are relevant (no random changes)

---

## 🎯 Common Commands

```bash
# Check status
git status

# View changes
git diff
git diff --staged

# Unstage file
git reset HEAD <file>

# Discard changes
git checkout -- <file>

# View commit history
git log --oneline --graph --all

# View branches
git branch -a

# Delete local branch
git branch -d feature/old-branch

# Delete remote branch
git push origin --delete feature/old-branch

# Stash changes
git stash
git stash pop

# Amend last commit (only if not pushed!)
git commit --amend --no-edit
```

---

## 🔍 Review Before Push

```bash
# What am I about to push?
git log origin/main..HEAD --oneline

# What files changed?
git diff origin/main..HEAD --stat

# Full diff
git diff origin/main..HEAD
```

---

## ⚠️ DO NOT

- ❌ Commit to main directly
- ❌ Force push to main (`git push --force`)
- ❌ Commit secrets (.env files)
- ❌ Commit node_modules
- ❌ Commit build artifacts (dist/, build/)
- ❌ Use vague commit messages ("fix", "update", "changes")
- ❌ Mix unrelated changes in one commit

---

## 📝 Quick Reference

| Action | Command |
|--------|---------|
| Start feature | `git checkout -b feature/T001-name` |
| Stage changes | `git add <files>` |
| Commit | `git commit -m "type(scope): message"` |
| Push | `git push -u origin feature/T001-name` |
| Merge to develop | `git checkout develop && git merge --no-ff feature/T001-name` |
| Tag release | `git tag -a v0.1.0 -m "Release message"` |

---

**Related Docs:**
- [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) - Architecture decisions (AD-XXX)
- [session-context.md](../.YBIS_Dev/Veriler/memory/session-context.md) - Current state
- [tasks.md](tasks.md) - Task tracking

---

**Version:** 1.0.0
**Next Review:** Week 2 (CI/CD integration)
