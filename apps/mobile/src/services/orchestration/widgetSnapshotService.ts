import Logger from '@ybis/logging';
import type {
  CalendarEventSummary,
  NoteSummary,
  TaskSummary,
  WorkflowDefinitionSummary,
} from '@ybis/core';

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

function resolveBaseUrl(): string | null {
  const configured = process.env['EXPO_PUBLIC_API_BASE_URL'];
  if (configured && configured.trim().length > 0) {
    return configured.replace(/\/$/, '');
  }
  return null;
}

export interface WidgetSnapshotMetadata {
  source: 'remote' | 'unconfigured' | 'error';
  retrievedAt: string;
  message?: string;
}

export interface WidgetSnapshot {
  notes: NoteSummary[];
  tasks: TaskSummary[];
  events: CalendarEventSummary[];
  workflows: WorkflowDefinitionSummary[];
  metadata: WidgetSnapshotMetadata;
}

interface RemoteWidgetSnapshotPayload {
  notes?: NoteSummary[];
  tasks?: TaskSummary[];
  events?: CalendarEventSummary[];
  workflows?: WorkflowDefinitionSummary[];
}

export async function fetchWidgetSnapshot(signal?: AbortSignal): Promise<WidgetSnapshot> {
  let baseUrl = resolveBaseUrl();
  let metadataSource: WidgetSnapshotMetadata['source'] = 'remote';
  let metadataMessage: string | undefined;

  if (!baseUrl) {
    Logger.warn('Widget snapshot service missing EXPO_PUBLIC_API_BASE_URL, using default fallback', {
      type: 'CONFIG',
    });
    baseUrl = DEFAULT_API_BASE_URL;
    metadataSource = 'unconfigured';
    metadataMessage = 'API tabanı yapılandırılmadı; yerel varsayılan kullanılıyor.';
  }

  const response = await fetch(`${baseUrl}/api/orchestration/snapshot`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    Logger.error('Failed to fetch widget snapshot', new Error(`HTTP ${response.status}`), {
      type: 'NETWORK',
      errorText,
    });
    return {
      notes: [],
      tasks: [],
      events: [],
      workflows: [],
      metadata: {
        source: 'error',
        retrievedAt: new Date().toISOString(),
        message: 'Widget verisi alınamadı. Sunucu yapılandırmasını kontrol edin.',
      },
    };
  }

  let payload: RemoteWidgetSnapshotPayload | null = null;
  try {
    payload = (await response.json()) as RemoteWidgetSnapshotPayload;
  } catch (error) {
    Logger.error('Widget snapshot response parse failed', error as Error, {
      type: 'NETWORK',
    });
  }

  return {
    notes: payload?.notes ?? [],
    tasks: payload?.tasks ?? [],
    events: payload?.events ?? [],
    workflows: payload?.workflows ?? [],
    metadata: {
      source: metadataSource,
      retrievedAt: new Date().toISOString(),
      message: metadataMessage,
    },
  };
}
