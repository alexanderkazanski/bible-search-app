import { useState, useEffect, useCallback } from 'react';
import type { BibleData } from '../types/bible';
import { loadVersion, getVersionList } from '../data/bibleData';

export function useBibleData() {
  const [version, setVersionState] = useState('kjv');
  const [bibleData, setBibleData] = useState<BibleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setIsLoading(true);
    const data = await loadVersion(id);
    setBibleData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load('kjv');
  }, [load]);

  const setVersion = useCallback(
    (id: string) => {
      setVersionState(id);
      load(id);
    },
    [load]
  );

  const versions = getVersionList();

  return { version, setVersion, bibleData, isLoading, versions };
}
