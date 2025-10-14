// Mobile App (Expo) Jest Configuration
// Extends: jest.config.base.js
// Purpose: React Native specific settings

module.exports = {
  preset: 'jest-expo',

  // Roots
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],

  // Transform
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },

  // Transform ignore patterns (for React Native modules)
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-native-gifted-chat|tamagui|@tamagui/.*)',
  ],

  // Module name mapper
  moduleNameMapper: {
    // Path aliases (adjusted for mobile app location)
    '^@ybis/ui$': '<rootDir>/../../packages/ui/src',
    '^@ybis/core$': '<rootDir>/../../packages/core/src',
    '^@ybis/chat$': '<rootDir>/../../packages/chat/src',
    '^@ybis/auth$': '<rootDir>/../../packages/auth/src',
    '^@ybis/database$': '<rootDir>/../../packages/database/src',
    '^@ybis/llm$': '<rootDir>/../../packages/llm/src',
    '^@ybis/theme$': '<rootDir>/../../packages/theme/src',
    '^@ybis/i18n$': '<rootDir>/../../packages/i18n/src',

    // Asset mocks
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '@testing-library/jest-native/extend-expect',
  ],

  // Test environment
  testEnvironment: 'node',

  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
    'app/**/*.{ts,tsx}', // Expo Router screens
    '!app/**/_layout.tsx', // Layout files are mostly config
  ],

  coverageThresholds: {
    global: {
      branches: 50, // Lower for mobile (UI components)
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // Higher coverage for business logic
    'src/services/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/stores/**/*.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Test match
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/.expo/',
  ],

  // Clear mocks
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
};
