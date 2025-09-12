/**
 * Utility functions for fetch operations
 * This helps prevent unnecessary revalidation and refetching
 */

// Default fetch options to prevent excessive revalidation
export const defaultFetchOptions = {
  // Disable auto refetching on window focus
  noRevalidateOnFocus: true,
  // Additional headers to send with fetch requests
  headers: {
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
  },
};

/**
 * Enhanced fetch function with proper caching controls
 * Use this instead of regular fetch to prevent unnecessary API calls
 */
export async function fetchOnce<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const opts = {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options?.headers,
    },
  };

  const response = await fetch(url, opts);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * When you need to wrap a useEffect with fetch in it,
 * use this pattern to prevent repeat calls:
 *
 * useEffect(() => {
 *   const controller = new AbortController();
 *
 *   async function loadData() {
 *     try {
 *       const data = await fetchOnce('/api/data', {
 *         signal: controller.signal
 *       });
 *       // Do something with data
 *     } catch (error) {
 *       if (!controller.signal.aborted) {
 *         console.error('Error fetching data:', error);
 *       }
 *     }
 *   }
 *
 *   void loadData();
 *
 *   return () => {
 *     controller.abort();
 *   };
 * }, []); // Empty dependency array = run once
 */
