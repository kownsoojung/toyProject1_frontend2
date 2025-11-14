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
  data?: any;
}

export interface CodeSearchDTO {
  'centerId'?: number;
  'tenantId'?: number;
  'codeName'?: string;
  'depth'?: number;
  'transferKind'?: number;
  'useFlag'?: number;
}

export type commonCodeType = "site" | "subCodeZip" | "counselCode" | "counselCategory" | "sendCall";