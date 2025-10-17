import { ColDef } from "ag-grid-community";

/**
 * AFormGridColumn 컴포넌트
 * AFormGrid 내부에서 선언적으로 컬럼을 정의할 때 사용
 * 
 * @example
 * <AFormGrid url="/api/data">
 *   <AFormGridColumn name="name" headerName="이름" width={200} />
 *   <AFormGridColumn field="age" headerName="나이" />
 * </AFormGrid>
 */
export interface AFormGridColumnProps extends Omit<ColDef, 'field'> {
  // ColDef의 모든 속성을 상속받되, field는 제외
  name?: string; // name 또는 field 사용 가능
  field?: string; // ColDef의 원래 field 속성
}

export const AFormGridColumn: React.FC<AFormGridColumnProps> = () => {
  // 이 컴포넌트는 실제로 렌더링되지 않음
  // AFormGrid가 children을 순회하면서 props만 추출하여 사용
  return null;
};

