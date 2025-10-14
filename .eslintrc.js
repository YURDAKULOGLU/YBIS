// YBIS Project - Root ESLint Configuration
// Version: 1.0.0
// Strategy: Strict quality enforcement from Day 1

module.exports = {
  root: true,

  // Environment
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },

  // Parser
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },

  // Extends
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Must be last to override other formatting rules
  ],

  // Plugins
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
  ],

  // Settings
  settings: {
    react: {
      version: '18.3.1',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },

  // Rules
  rules: {
    // ========================================
    // TypeScript Rules (STRICT)
    // ========================================
    '@typescript-eslint/no-explicit-any': 'error', // NO any allowed
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': ['warn', {
      prefer: 'type-imports',
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      allowString: false,
      allowNumber: false,
      allowNullableObject: false,
    }],

    // ========================================
    // React Rules
    // ========================================
    'react/react-in-jsx-scope': 'off', // Not needed in React 18+
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

    // ========================================
    // React Hooks Rules
    // ========================================
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ========================================
    // Import Rules
    // ========================================
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling'],
        'index',
        'type',
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',

    // ========================================
    // General Rules
    // ========================================
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

  // Overrides for specific file patterns
  overrides: [
    // Test files
    {
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },

    // JavaScript config files
    {
      files: ['*.js', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },

    // Mobile app (Expo)
    {
      files: ['apps/mobile/**/*'],
      extends: ['expo'],
      rules: {
        'import/no-unresolved': ['error', {
          ignore: ['^expo', '^@expo'],
        }],
      },
    },
  ],

  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.expo/',
    '.next/',
    'android/',
    'ios/',
    '*.config.js',
    '*.config.ts',
  ],
};
