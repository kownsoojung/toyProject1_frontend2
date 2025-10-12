// useGrid.ts
import { AFormGridHandle } from "@/components/AFormItem/Grid/AGrid";
import { useRef } from "react";

export const useGrid = () => {
  const ref = useRef<AFormGridHandle>(null);

  return {
    ref,
    refetch: (params?: Record<string, any>) => ref.current?.refetch(params),
  };
};
