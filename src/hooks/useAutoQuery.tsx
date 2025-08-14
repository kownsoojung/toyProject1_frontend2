import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  return (
    '?' +
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) =>
        Array.isArray(v)
          ? v.map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`).join('&')
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      )
      .join('&')
  );
}

export function useAutoQuery<T = unknown>(
  url: string,
  queryParams?: Record<string, any>,
  options?: UseQueryOptions<T, Error, T>
): UseQueryResult<T> {
  const queryKey = [url + buildQueryString(queryParams)];

  const fetcher = async (): Promise<T> => {
    const finalUrl = url + buildQueryString(queryParams);

    const res = await fetch(finalUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json();
  };

  return useQuery<T, Error>({
    queryKey,
    queryFn: fetcher,
    ...options,
  });
}