import { useCallback } from 'react';

export function useUrlStateNoRerender() {
  // Read state from URL
  const getStateFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      code: params.get('code') || '',
      org: params.get('org') || '',
      step: params.get('step') || '',
      estimation: params.get('estimation') || '',
    };
  }, []);

  // Update URL without re-render
  const setStateInUrl = useCallback((state: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  return { getStateFromUrl, setStateInUrl };
} 