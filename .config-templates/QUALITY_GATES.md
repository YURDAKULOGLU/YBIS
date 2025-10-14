# YBIS Quality Gates Checklist

**Version:** 1.0.0
**Purpose:** Automated and manual quality gates that MUST pass before merging
**Related:** `quality-standards.md` v2.0.0

---

## Pre-Commit Gate (Automated)

Enforced by Husky + lint-staged. **Cannot commit without passing.**

- [ ] **ESLint**: No errors, max 0 warnings
- [ ] **Prettier**: All files formatted
- [ ] **TypeScript**: `tsc --noEmit` passes (no type errors)

**How to fix:**
```bash
# Fix ESLint issues
npm run lint -- --fix

# Format with Prettier
npm run format

# Check TypeScript
npm run type-check
```

---

## Pre-Push Gate (Manual - Week 3+ with NX)

Run before pushing to remote. **Required for all pushes.**

```bash
# Week 1-2 (npm workspaces)
npm run test --workspaces --if-present
npm run build --workspaces --if-present

# Week 3+ (NX)
nx affected:test
nx affected:build
```

### Checklist:
- [ ] All affected tests pass
- [ ] All affected builds succeed
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## Pre-PR Gate (Manual)

Required before creating Pull Request. **Non-negotiable.**

### Code Quality
- [ ] **ESLint**: Zero errors, zero warnings
- [ ] **TypeScript**: Strict mode passes
- [ ] **Prettier**: All files formatted
- [ ] **No console.log**: Removed or replaced with proper logger

### Testing
- [ ] **Unit tests**: Added for new functions/methods
- [ ] **Integration tests**: Added for new features (if applicable)
- [ ] **Test coverage**: Meets threshold (70% overall, 90% domain logic)
- [ ] **All tests pass**: `npm run test` or `nx run-many --target=test --all`

### Documentation
- [ ] **i18n keys**: Added for all new user-facing strings
- [ ] **Port interfaces**: Documented if new port added
- [ ] **Code comments**: Added for complex logic
- [ ] **README**: Updated if public API changed

### Port Architecture (if applicable)
- [ ] New adapter implements port interface completely
- [ ] Error handling present
- [ ] Logging added for important events
- [ ] Migration path documented

### Performance
- [ ] **No performance regressions**: Compare build times, bundle sizes
- [ ] **Lazy loading**: Used where appropriate
- [ ] **Memoization**: Applied to expensive computations

### Security
- [ ] **No secrets**: API keys, passwords moved to env vars
- [ ] **Input validation**: User inputs validated
- [ ] **No SQL injection**: Parameterized queries used

---

## Pre-Deploy Gate (Manual)

Required before deploying to any environment. **Critical.**

### Testing
- [ ] **All tests pass**: 100% pass rate
- [ ] **Manual testing**: Completed on real devices (iOS + Android)
- [ ] **Regression testing**: Existing features still work

### Performance
- [ ] **App launch time**: <2s (cold start)
- [ ] **AI response time**: <5s (p95)
- [ ] **Build size**: Within limits (iOS <50MB, Android <30MB)

### Monitoring
- [ ] **Sentry configured**: Error tracking enabled
- [ ] **Analytics working**: Events tracked correctly
- [ ] **Error rate**: <1% in staging

### Database
- [ ] **Migrations tested**: Applied successfully in staging
- [ ] **Rollback plan**: Documented if schema changes
- [ ] **Backup verified**: Recent backup exists

### Environment
- [ ] **Environment variables**: Set correctly for target environment
- [ ] **API endpoints**: Pointing to correct environment
- [ ] **Feature flags**: Configured correctly

---

## Port Migration Gate (Manual)

Required when migrating a port adapter. **High risk operation.**

### Pre-Migration
- [ ] New adapter implemented and tested
- [ ] Integration tests pass with new adapter
- [ ] Performance benchmarks comparable
- [ ] Error handling verified

### Migration
- [ ] Feature flag created for adapter swap
- [ ] Dual-write implemented (if data migration needed)
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

### Post-Migration
- [ ] Error rate <1% for 24 hours
- [ ] Performance metrics stable
- [ ] No user-reported issues
- [ ] Old adapter removed after 1 week stability

---

## Emergency Bypass

**Only use in production emergency. Requires approval from 2+ team members.**

If you must bypass quality gates:

1. Create GitHub issue documenting:
   - Why bypass needed
   - Which gates bypassed
   - Plan to fix
   - Timeline for fix

2. Add `[BYPASS]` prefix to commit message

3. Create follow-up PR within 24 hours to fix issues

**Example:**
```bash
git commit -m "[BYPASS] Hotfix: Critical auth bug - will add tests in follow-up PR #123"
```

---

## Automation Status

### Automated (Enforced)
✅ Pre-commit: ESLint, Prettier, TypeScript
✅ CI/CD: Tests, builds (when set up)

### Manual (Required)
⚠️ Pre-PR: Coverage, documentation, i18n
⚠️ Pre-deploy: Manual testing, performance checks
⚠️ Port migration: All gates

### Future Automation (Post-Closed Beta)
🔮 Visual regression tests
🔮 Performance regression tests
🔮 Accessibility tests
🔮 Bundle size monitoring

---

**Status:** ✅ READY TO ENFORCE
**Last Updated:** 2025-01-06
**Next Review:** After Week 1 (refine based on learnings)
