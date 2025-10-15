// YBIS Shared ESLint Configuration
// Base configuration for all packages

import js from '@eslint/js';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/.next/**',
      '**/android/**',
      '**/ios/**',
      '**/*.config.js',
      '**/*.config.ts',
    ],
  },

  // Base config for all files
  js.configs.recommended,

  // Base rules
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'off', // Disable base rule, use TypeScript version
      'no-console': ['warn', {
        allow: ['warn', 'error'],
      }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
    },
  },
];
