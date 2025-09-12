/**
 * Example of correct useEffect usage with fetch
 * Copy this pattern when adding fetch calls to components
 */

import { useState, useEffect } from 'react';

export function useCorrectDataFetching<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Create abort controller for cleanup
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(url, {
          // Pass signal to make fetch abortable
          signal: controller.signal,
          // Prevent unnecessary refetches
          headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        // Only set error if not aborted
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        // Only update loading state if not aborted
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    // Use void to handle the promise
    void fetchData();

    // Cleanup function to abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array means run once on mount

  return { data, loading, error };
}

/**
 * Example of useEffect usage with dependencies
 */
export function useDependentDataFetching<T>(url: string, id: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip fetch if id is null
    if (!id) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(`${url}/${id}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      controller.abort();
    };
  }, [url, id]); // Run when url or id changes

  return { data, loading, error };
}
