export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  type: string; // e.g., 'USER_ACTION', 'LIFECYCLE', 'API_CALL'
  [key: string]: unknown; // Allows any other structured data
}

export interface LoggingPort {
  log(level: LogLevel, message: string, payload?: LogPayload): void;
  debug(message: string, payload?: LogPayload): void;
  info(message: string, payload?: LogPayload): void;
  warn(message: string, payload?: LogPayload): void;
  error(message: string, error?: Error, payload?: LogPayload): void;
}
