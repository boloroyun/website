# Reducing API Calls in Next.js Application

This guide explains how to reduce excessive API calls and optimize data fetching in your Next.js application.

## Common Causes of Excessive API Calls

1. **Focus-triggered revalidation** - Data fetching libraries like SWR and React Query by default refetch data when the window regains focus
2. **Unnecessary refresh intervals** - Setting refresh intervals too short or when they're not needed
3. **Incorrect useEffect dependencies** - Missing or incorrect dependency arrays causing repeated fetches
4. **Console.log spam** - Excessive logging in API routes can impact performance

## The Debug Logger

A new logger utility has been added to help control console output:

```typescript
// lib/logger.ts
import { logger } from '@/lib/logger';

logger.debug('Debug message'); // Only prints if DEBUG_LOGS=1 in .env.local
logger.info('Info message'); // Always prints in development, controlled in production
logger.warn('Warning message'); // Always prints
logger.error('Error message'); // Always prints
```

### Enabling Debug Logs

Add the following to your `.env.local` file:

```
DEBUG_LOGS=1
```

## Best Practices for Data Fetching

### For SWR

```typescript
import useSWR from 'swr';

// Disable revalidation on focus and only fetch once
const { data } = useSWR('/api/endpoint', fetcher, {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
});
```

### For React Query

```typescript
import { useQuery } from 'react-query';

// Disable refetching on window focus
const { data } = useQuery('queryKey', fetchFn, {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: Infinity, // For data that rarely changes
});
```

### For useEffect Fetches

```typescript
// Run fetch once on mount (empty dependency array)
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  };

  fetchData();
}, []); // Empty array means run once on mount
```

If your fetch depends on certain values:

```typescript
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`/api/data?id=${id}`);
    const data = await response.json();
    setData(data);
  };

  fetchData();
}, [id]); // Only re-run when id changes
```

## Automation Script

A script has been added to help update console.log calls to use the new logger:

```bash
node scripts/update-console-logs.js
```

This script automatically:

1. Finds all API routes
2. Replaces console.log calls with logger.debug
3. Adds the necessary import statements

## Performance Monitoring

Consider adding performance monitoring to identify excessive API calls:

- Use browser network tab to monitor API requests
- Consider tools like [React Query Devtools](https://react-query.tanstack.com/devtools) if using React Query
- Add server-side timing logs for critical operations
