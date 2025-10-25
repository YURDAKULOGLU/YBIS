import type { CalendarEventSummary } from '../types';

/**
 * CalendarPort - abstraction over calendar providers (Google, Microsoft, etc.).
 */
export interface CalendarPort {
  /**
   * Retrieve upcoming events for the authenticated user.
   */
  listUpcomingEvents(params?: {
    limit?: number;
    timeMin?: string;
    timeMax?: string;
  }): Promise<CalendarEventSummary[]>;

  /**
   * Fetch a single event by identifier.
   */
  getEventById(id: string): Promise<CalendarEventSummary | null>;
}
