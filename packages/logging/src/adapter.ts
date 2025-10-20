import { type LoggingPort, type LogLevel, type LogPayload } from './port';

/**
 * A simple logger that outputs to the console.
 * Implements the LoggingPort for our closed beta needs.
 */
export class ConsoleLogger implements LoggingPort {
  private formatMessage(level: LogLevel, message: string, payload?: LogPayload, error?: Error): string {
    const timestamp = new Date().toISOString();
    let logString = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (payload) {
      logString += `\n${JSON.stringify(payload, null, 2)}`;
    }

    if (error?.stack) {
      logString += `\n${error.stack}`;
    } else if (error) {
      logString += `\nError: ${error.message}`;
    }

    return logString;
  }

  public log(level: LogLevel, message: string, payload?: LogPayload): void {
    const formattedMessage = this.formatMessage(level, message, payload);
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  public debug(message: string, payload?: LogPayload): void {
    this.log('debug', message, payload);
  }

  public info(message: string, payload?: LogPayload): void {
    this.log('info', message, payload);
  }

  public warn(message: string, payload?: LogPayload): void {
    this.log('warn', message, payload);
  }

  public error(message: string, error?: Error, payload?: LogPayload): void {
    const formattedMessage = this.formatMessage('error', message, payload, error);
    console.error(formattedMessage);
  }
}
