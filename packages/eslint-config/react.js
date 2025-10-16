// YBIS React ESLint Configuration
// React-specific rules for mobile and web apps

import tsConfig from './typescript.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...tsConfig,
  
  // Ignore patterns (ESLint v9 - replaces .eslintignore)
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
      '**/index.js', // Expo entry point - JSX in .js file
    ],
  },
  
  // React files
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: '19.1.0',
      },
    },
    rules: {
      // React Rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 19+
      'react/prop-types': 'off', // Using TypeScript instead
      'react/jsx-no-bind': ['warn', {
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
      }],
      'react/jsx-key': ['error', {
        checkFragmentShorthand: true,
      }],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Prettier config (must be last)
  prettierConfig,
];
