import type { NoteSummary } from '../types';

/**
 * NotePort - abstraction over note providers (Docs, Notion, internal notes).
 */
export interface NotePort {
  /**
   * List recently edited notes for quick access.
   */
  listRecentNotes(params?: { limit?: number }): Promise<NoteSummary[]>;

  /**
   * Fetch note metadata by identifier.
   */
  getNoteById(id: string): Promise<NoteSummary | null>;
}
