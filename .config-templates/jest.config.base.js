// YBIS Project - Base Jest Configuration
// Version: 1.0.0
// Target: 70% overall coverage, 90% domain logic

module.exports = {
  // Use ts-jest preset for TypeScript
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Roots
  roots: ['<rootDir>/src'],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        // Inline tsconfig for tests
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
    }],
  },

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@ybis/ui$': '<rootDir>/../../packages/ui/src',
    '^@ybis/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    '^@ybis/core$': '<rootDir>/../../packages/core/src',
    '^@ybis/core/(.*)$': '<rootDir>/../../packages/core/src/$1',
    '^@ybis/chat$': '<rootDir>/../../packages/chat/src',
    '^@ybis/chat/(.*)$': '<rootDir>/../../packages/chat/src/$1',
    '^@ybis/auth$': '<rootDir>/../../packages/auth/src',
    '^@ybis/auth/(.*)$': '<rootDir>/../../packages/auth/src/$1',
    '^@ybis/database$': '<rootDir>/../../packages/database/src',
    '^@ybis/database/(.*)$': '<rootDir>/../../packages/database/src/$1',
    '^@ybis/llm$': '<rootDir>/../../packages/llm/src',
    '^@ybis/llm/(.*)$': '<rootDir>/../../packages/llm/src/$1',
    '^@ybis/theme$': '<rootDir>/../../packages/theme/src',
    '^@ybis/theme/(.*)$': '<rootDir>/../../packages/theme/src/$1',
    '^@ybis/i18n$': '<rootDir>/../../packages/i18n/src',
    '^@ybis/i18n/(.*)$': '<rootDir>/../../packages/i18n/src/$1',
  },

  // Coverage
  collectCoverage: false, // Enable only when needed
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
    '!src/**/index.ts', // Index files are just re-exports
  ],

  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Globals
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
