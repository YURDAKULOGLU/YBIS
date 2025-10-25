import { useCallback, useEffect, useRef, useState } from 'react';
import Logger from '@ybis/logging';
import {
  fetchWidgetSnapshot,
  type WidgetSnapshot,
} from '../../../services/orchestration/widgetSnapshotService';

interface UseWidgetSnapshotReturn {
  snapshot: WidgetSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useWidgetSnapshot(): UseWidgetSnapshotReturn {
  const [snapshot, setSnapshot] = useState<WidgetSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    try {
      const data = await fetchWidgetSnapshot(controller.signal);
      setSnapshot(data);
      if (data.metadata.source === 'error') {
        setError(data.metadata.message ?? 'Widget verisi alınamadı.');
      } else {
        setError(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Widget verisi alınamadı.';
      Logger.error('Widget snapshot refresh failed', err as Error, { type: 'NETWORK' });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [refresh]);

  return {
    snapshot,
    isLoading,
    error,
    refresh,
  };
}
