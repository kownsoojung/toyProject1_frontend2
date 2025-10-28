import { useAutoQuery } from "./useAutoQuery";
import { CodeSearchDTO} from "@/api/generated";

/**
 * 공통코드 인터페이스
 */
export interface CommonCode {
  label: string;
  value: string | number;
  codeNumber?: number;
  codeDesc?: string;
  disabled?: boolean;
  parentValue?: string;
}

/**
 * SiteCodeDTO를 CommonCode로 변환하는 함수
 */
const convertToCommonCode = <T extends Record<string, any>>(dto: T, options?: { valueAsNumber?: boolean }): CommonCode => {
  let value = dto.value ||  "";
  let parentValue = dto.parentValue || "";
  
  // ✅ 옵션에 따라 숫자로 변환
  if (options?.valueAsNumber && value !== "") {
    value = Number(value);
    parentValue = Number(parentValue);
  }
  
  return {
    label: dto.label || "",
    value: value,
    codeNumber: dto.codeNumber,
    codeDesc: dto.codeDesc,
    disabled: dto.disabled,
    parentValue: dto.parentValue,
  };
};

/**
 * 공통 코드 조회 Hook
 * 컴포넌트 마운트 시 자동으로 코드 데이터를 조회합니다.
 * SiteCodeDTO[]를 CommonCode[]로 변환하여 반환합니다.
 */
export const useSiteCode = (params: CodeSearchDTO): CommonCode[] | undefined => {
  const { data } = useAutoQuery<CodeSearchDTO[]>({
    queryKey: ["code", params.codeName, params],
    url: `/api/common/code/getSiteCode`,
    params,
  });

  return data?.map(value => convertToCommonCode(value, { valueAsNumber: true }));
};    

export const useSubCodeZip = (params: CodeSearchDTO): CommonCode[] | undefined => {
  const { data } = useAutoQuery<CodeSearchDTO[]>({
    queryKey: ["code", params.codeName, params],
    url: `/api/common/code/getSubCodeZip`,
    params,
  });

  return data?.map(value => convertToCommonCode(value, { valueAsNumber: true }));
};    

export const useCounselCode = (params: CodeSearchDTO): CommonCode[] | undefined => {
  const { data } = useAutoQuery<CodeSearchDTO[]>({
    queryKey: ["code", params.codeName, params],
    url: `/api/common/code/getCounselCode`,
    params,
  });

  return data?.map(value => convertToCommonCode(value, { valueAsNumber: false }));
};    

export const useCounselCategory = (params: CodeSearchDTO): CommonCode[] | undefined => {
  const { data } = useAutoQuery<CodeSearchDTO[]>({
    queryKey: ["code", params.codeName, params],
    url: `/api/common/code/getCounselCategory`,
    params,
  });

  return data?.map(value => convertToCommonCode(value, { valueAsNumber: true }));
};    

/**
 * 공통 코드 타입별 조회 Hook
 * 모든 Form 컴포넌트에서 재사용 가능
 */
export const useCommonCode = (
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory",
  params?: CodeSearchDTO
): CommonCode[] | undefined => {
  
  // codeType이나 params가 없으면 undefined 반환
  if (!codeType || !params) {
    return undefined;
  }

  // 각 타입별 Hook 호출
  const siteCode = codeType === "site" ? useSiteCode(params) : undefined;
  const subCodeZip = codeType === "subCodeZip" ? useSubCodeZip(params) : undefined;
  const counselCode = codeType === "counselCode" ? useCounselCode(params) : undefined;
  const counselCategory = codeType === "counselCategory" ? useCounselCategory(params) : undefined;

  // codeType에 따라 적절한 데이터 반환
  return siteCode || subCodeZip || counselCode || counselCategory;
};