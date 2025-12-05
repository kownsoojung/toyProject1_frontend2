import { CommonConfig } from "@/types";
import { useAutoQuery } from "../api/useAutoQuery";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";

export function useConfig() {
  // isGlobal:true → React Query가 전역 캐시처럼 한 번만 조회
  const { data: config, isLoading, error } = useAutoQuery<CommonConfig>({
    queryKey: "config",
    url: "/api/config",
    isGlobal: true,
  });

  if (error) {
    console.warn("⚠️ Config API 에러:", error);
  }

  return { config, isLoading, error };
}

export function getConfig(): CommonConfig | undefined {
  return queryClient.getQueryData<CommonConfig>(["config"]);
}