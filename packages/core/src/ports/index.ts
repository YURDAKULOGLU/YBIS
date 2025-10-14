/**
 * Port Interfaces - Abstract interfaces for external dependencies
 *
 * All ports follow the "zero vendor lock-in" principle.
 * Applications should depend on these interfaces, not concrete implementations.
 */

// Auth Port
export * from './AuthPort';

// Database Port
export * from './DatabasePort';

// LLM Port
export * from './LLMPort';

// Storage Port
export * from './StoragePort';
