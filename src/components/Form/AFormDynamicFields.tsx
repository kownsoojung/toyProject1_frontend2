import { DynamicFieldConfig } from "@/hooks/useDynamicFields";
import { TableCell, TableRow } from "@mui/material";
import {
  AFormCheckbox,
  AFormDate,
  AFormNumber,
  AFormRadio,
  AFormSelect,
  AFormTextField,
} from "@/components/Form";

interface AFormDynamicFieldsProps {
  fields: DynamicFieldConfig[];
  namePrefix?: string; // "additionalFields" 등
  columnsPerRow?: number; // 한 행에 몇 개의 필드를 표시할지 (기본: 2)
}

/**
 * 동적 필드를 렌더링하는 컴포넌트
 * - API로부터 받은 필드 설정에 따라 자동으로 Form 필드 생성
 * - radio, check, select, date, number, text 타입 지원
 */
export const AFormDynamicFields = ({ 
  fields, 
  namePrefix = "additionalFields",
  columnsPerRow = 2 
}: AFormDynamicFieldsProps) => {
  
  // 필드 타입별 렌더링
  const renderField = (field: DynamicFieldConfig) => {
    const fieldName = `${namePrefix}.${field.key}`;
    
    switch (field.type) {
      case "radio":
        return (
          <AFormRadio 
            name={fieldName} 
            list={field.options || []}
            row={true}
          />
        );
        
      case "check":
        return (
          <AFormCheckbox 
            name={fieldName} 
            list={field.options || []}
            row={true}
          />
        );
        
      case "select":
        return (
          <AFormSelect 
            name={fieldName} 
            list={field.options || []}
            placeholder="선택"
          />
        );
        
      case "date":
        return <AFormDate name={fieldName} />;
        
      case "number":
        return (
          <AFormNumber 
            name={fieldName}
          />
        );
        
      case "text":
      default:
        return <AFormTextField name={fieldName} />;
    }
  };

  // 행 단위로 그룹화하여 렌더링
  const renderRows = () => {
    const rows = [];
    
    for (let i = 0; i < fields.length; i += columnsPerRow) {
      const rowFields = fields.slice(i, i + columnsPerRow);
      
      rows.push(
        <TableRow key={`dynamic-row-${i}`}>
          {rowFields.map(field => (
            <>
              <TableCell component="th" key={`th-${field.key}`}>
                {field.name}
              </TableCell>
              <TableCell key={`td-${field.key}`}>
                {renderField(field)}
              </TableCell>
            </>
          ))}
          
          {/* 빈 셀 채우기 (columnsPerRow보다 필드가 적은 경우) */}
          {rowFields.length < columnsPerRow && 
            Array.from({ length: (columnsPerRow - rowFields.length) * 2 }).map((_, idx) => (
              <TableCell key={`empty-${i}-${idx}`}></TableCell>
            ))
          }
        </TableRow>
      );
    }
    
    return rows;
  };

  // 필드가 없으면 아무것도 렌더링하지 않음
  if (fields.length === 0) return null;

  return <>{renderRows()}</>;
};


