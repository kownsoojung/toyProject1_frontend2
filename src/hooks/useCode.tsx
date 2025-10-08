import { UseAutoQuery } from "./useAutoQuery";
import { SiteCodeDTO, SiteCodeSearchDTO } from "@/api/generated";

export interface CodeItem {
  label: string;
  value: any;
  parent:number|string;
  disabled: boolean;
}

export const useCode = (params: SiteCodeSearchDTO) => {
  return UseAutoQuery<SiteCodeDTO[]>({
    queryKey: ["code", params.codeName, params],   // 고유 key
    url: `/api/sitecode/getList`,           // 코드 조회 API 엔드포인트
    params,
  });
};
