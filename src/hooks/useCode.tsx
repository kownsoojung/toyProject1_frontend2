import { useAutoQuery } from "./useAutoQuery";
import { SiteCodeDTO, SiteCodeSearchDTO } from "@/api/generated";



/**
 * 공통 코드 조회 Hook
 * 컴포넌트 마운트 시 자동으로 코드 데이터를 조회합니다.
 */
export const useCode = (params: SiteCodeSearchDTO) => {
  return useAutoQuery<SiteCodeDTO[]>({
    queryKey: ["code", params.codeName, params],
    url: `/api/common/code/getList`,
    params,
  });
};
