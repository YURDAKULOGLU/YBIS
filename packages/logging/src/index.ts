import { ConsoleLogger } from './adapter';

// Export the core types and interfaces for dependency injection or type safety
export * from './port';

// Create a single, shared instance of the logger for the entire app
const Logger = new ConsoleLogger();

// Export the singleton instance as the default export
export default Logger;
