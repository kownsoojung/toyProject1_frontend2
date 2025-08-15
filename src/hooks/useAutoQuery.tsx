import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export function useAutoQuery<T = unknown>(
  key: string,
  endpoint: string, // 반드시 "/api/..." 형태
  options?: UseQueryOptions<T, Error, T>
): UseQueryResult<T> {
  const fetcher = async (): Promise<T> => {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  };

  return useQuery<T, Error>({ queryKey: [key], queryFn: fetcher, ...options });
}