# YBIS Configuration Templates

**Version:** 1.0.0
**Purpose:** Production-ready configuration files for YBIS project
**Strategy:** Strictest quality standards from Day 1

---

## 📋 Contents

This directory contains all configuration templates for the YBIS project:

### Core Configurations
- `.eslintrc.js` - ESLint configuration (strict TypeScript rules)
- `tsconfig.base.json` - Root TypeScript configuration (all strict options enabled)
- `tsconfig.mobile.json` - Mobile app (Expo) specific TypeScript config
- `.prettierrc.json` - Code formatting rules
- `.prettierignore` - Files to skip formatting

### Testing
- `jest.config.base.js` - Base Jest configuration
- `jest.config.mobile.js` - Mobile-specific Jest configuration
- `jest.setup.js` - Global test setup

### Git Hooks
- `.husky/pre-commit` - Pre-commit hook script
- `.lintstagedrc.json` - lint-staged configuration

### Documentation
- `QUALITY_GATES.md` - Complete quality gate checklist
- `README.md` - This file

---

## 🚀 How to Use

### Step 1: Copy to Root (Week 1, Day 1)

After creating workspace structure, copy these files to root:

```bash
# From project root
cp .config-templates/.eslintrc.js .
cp .config-templates/tsconfig.base.json .
cp .config-templates/.prettierrc.json .
cp .config-templates/.prettierignore .
cp .config-templates/.lintstagedrc.json .
cp .config-templates/jest.config.base.js .
cp .config-templates/jest.setup.js .
cp .config-templates/QUALITY_GATES.md .
```

### Step 2: Copy App-Specific Configs

For mobile app:

```bash
cp .config-templates/tsconfig.mobile.json apps/mobile/tsconfig.json
cp .config-templates/jest.config.mobile.js apps/mobile/jest.config.js
cp .config-templates/jest.setup.js apps/mobile/jest.setup.js
```

### Step 3: Install Dependencies

```bash
# Core
npm install -D eslint prettier typescript

# ESLint plugins
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-config-prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D eslint-plugin-import

# Testing
npm install -D jest ts-jest @types/jest
npm install -D jest-watch-typeahead

# Git hooks
npm install -D husky lint-staged

# Mobile (Expo) specific
cd apps/mobile
npm install -D jest-expo @testing-library/jest-native
```

### Step 4: Initialize Husky

```bash
# Enable git hooks
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

### Step 5: Add Scripts to package.json

Add to root `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "prepare": "husky install"
  }
}
```

### Step 6: Verify Setup

```bash
# Lint check
npm run lint

# Format check
npm run format

# Type check
npm run type-check

# Test
npm run test

# Try committing (should run pre-commit hook)
git add .
git commit -m "test: verify quality gates"
```

---

## 📊 Quality Standards Summary

### TypeScript: STRICTEST
- ✅ All strict options enabled
- ✅ No `any` allowed
- ✅ Index signature safety
- ✅ Explicit return types

### ESLint: ZERO TOLERANCE
- ❌ No errors allowed
- ❌ No warnings allowed (max 0)
- ✅ Automatic fixes on commit

### Testing: HIGH COVERAGE
- 🎯 70% overall coverage
- 🎯 90% domain logic coverage
- 🎯 50% UI components coverage

### Pre-commit: AUTOMATIC
- ✅ ESLint fixes applied
- ✅ Prettier formatting applied
- ✅ TypeScript type checking

---

## 🔧 Customization

### Adjusting ESLint Rules

Edit `.eslintrc.js`:

```javascript
rules: {
  // Change from error to warn
  '@typescript-eslint/no-explicit-any': 'warn',

  // Disable a rule
  '@typescript-eslint/explicit-function-return-type': 'off',
}
```

### Adjusting Coverage Thresholds

Edit `jest.config.base.js`:

```javascript
coverageThresholds: {
  global: {
    branches: 60, // Lower from 70
    functions: 60,
    lines: 60,
    statements: 60,
  },
}
```

### Disabling Pre-commit Hooks

**NOT recommended, but if needed:**

```bash
# Skip hooks for one commit
git commit --no-verify -m "message"

# Disable hooks completely
rm -rf .husky
```

---

## 🐛 Troubleshooting

### ESLint errors on commit

```bash
# See what's wrong
npm run lint

# Auto-fix
npm run lint:fix
```

### TypeScript errors on commit

```bash
# See errors
npm run type-check

# Fix manually based on output
```

### Jest fails to find modules

Check `moduleNameMapper` in `jest.config.*.js` matches your `tsconfig.json` paths.

### Husky hooks not running

```bash
# Reinstall hooks
npx husky install

# Check hook permissions (Unix)
chmod +x .husky/pre-commit
```

---

## 📚 Related Documentation

- `docs/Güncel/quality-standards.md` - Full quality standards
- `docs/Güncel/constitution.md` - Project principles
- `.config-templates/QUALITY_GATES.md` - Quality gate checklist

---

## 🔄 Version History

- **1.0.0** (2025-01-06) - Initial configuration templates
  - ESLint with strict TypeScript rules
  - TypeScript with all strict options
  - Jest with coverage thresholds
  - Husky + lint-staged pre-commit hooks
  - Quality gates documentation

---

**Status:** ✅ READY TO USE
**Next Step:** Copy to root and install dependencies (Week 1, Day 1)
