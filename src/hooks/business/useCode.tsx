// src/hooks/business/useCode.ts
import { CodeSearchDTO, CommonCode, commonCodeType } from "@/types";
import { useAutoQuery } from "../api/useAutoQuery";

/**
 * DTO → CommonCode 변환
 */
const convertToCommonCode = <T extends Record<string, any>>(dto: T, options?: { valueAsNumber?: boolean }): CommonCode => ({
  label: dto.label || "",
  value: options?.valueAsNumber && dto.value !== "" ? Number(dto.value) : dto.value ?? "",
  parentValue: dto.parentValue ?? "",
  codeNumber: dto.codeNumber,
  codeDesc: dto.codeDesc,
  disabled: dto.disabled,
  data: dto,
});

/**
 * 공통 코드 fetcher 훅
 */
const useCodeFetcher = (url: string, params?: CodeSearchDTO): CommonCode[] | undefined => {
  const codeName = params?.codeName ?? "";
  const { data } = useAutoQuery<any[]>({
    queryKey: [url, codeName, params],
    url,
    params,
  });

  return data?.map((value) => convertToCommonCode(value, { valueAsNumber: false }));
};

/**
 * 각 코드 타입별 훅
 */
export const useSiteCode = (params: CodeSearchDTO) => useCodeFetcher(`/api/common/code/getSiteCode`, params);
export const useSubCodeZip = (params: CodeSearchDTO) => useCodeFetcher(`/api/common/code/getSubCodeZip`, params);
export const useCounselCode = (params: CodeSearchDTO) => useCodeFetcher(`/api/common/code/getCounselCode`, params);
export const useCounselCategory = (params: CodeSearchDTO) => useCodeFetcher(`/api/common/code/getCounselCategory`, params);
export const useSendCall = (): CommonCode[] | undefined => {
  const { data } = useAutoQuery<any[]>({
    queryKey: ["sendCall"],
    url: `/api/common/counsel/sendCall/getNumber`,
  });

  return data?.map((value) => ({
    label: value.sendingName || "",
    value: value.sendingNumber,
    data: value,
  }));
};

/**
 * codeType → 훅 매핑
 */
const codeTypeMap: Record<commonCodeType, (params?: CodeSearchDTO) => CommonCode[] | undefined> = {
  site: useSiteCode,
  subCodeZip: useSubCodeZip,
  counselCode: useCounselCode,
  counselCategory: useCounselCategory,
  sendCall: useSendCall,
};

/**
 * 공통 코드 조회 Hook
 * codeType과 params에 따라 적절한 데이터 반환
 * React Hook 규칙 준수 (조건문 안에서 훅 호출 X)
 */
export const useCommonCode = (codeType?: commonCodeType, params?: CodeSearchDTO): CommonCode[] | undefined => {
  if (!codeType) return undefined;
  const hook = codeTypeMap[codeType];
  return hook(params);
};
