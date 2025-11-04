import React from "react";
import { DynamicFieldConfig } from "@/hooks/useDynamicFields";
import { TableCell, TableRow } from "@mui/material";
import {
  ASelect,
  ATextField,
  ANumber,
  ACheckbox,
  ARadio,
  ADate,
} from "@/components/Form";

interface ADynamicFieldsFormProps {
  fields: DynamicFieldConfig[];
  namePrefix?: string;
  columnsPerRow?: number;
}

// Form 래퍼 컴포넌트 (react-hook-form 전용)
const ADynamicFieldsForm: React.FC<ADynamicFieldsFormProps> = ({
  fields,
  namePrefix = "additionalFields",
  columnsPerRow = 2,
}) => {
  // 필드 타입별 렌더링
  const renderField = (field: DynamicFieldConfig) => {
    const fieldName = `${namePrefix}.${field.key}`;
    
    switch (field.type) {
      case "radio":
        return (
          <ARadio.Form
            name={fieldName}
            list={field.options || []}
            row={true}
          />
        );
        
      case "check":
        return (
          <ACheckbox.Form
            name={fieldName}
            list={field.options || []}
            row={true}
          />
        );
        
      case "select":
        return (
          <ASelect.Form
            name={fieldName}
            list={field.options || []}
            placeholder="선택"
          />
        );
        
      case "date":
        return <ADate.Form name={fieldName} />;
        
      case "number":
        return <ANumber.Form name={fieldName} />;
        
      case "text":
      default:
        return <ATextField.Form name={fieldName} />;
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
            <React.Fragment key={field.key}>
              <TableCell component="th">
                {field.name}
              </TableCell>
              <TableCell>
                {renderField(field)}
              </TableCell>
            </React.Fragment>
          ))}
          
          {/* 빈 셀 채우기 */}
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

  if (fields.length === 0) return null;

  return <>{renderRows()}</>;
};

// 컴포넌트 합성 (Form 전용)
export const ADynamicFields = Object.assign(ADynamicFieldsForm, {
  Form: ADynamicFieldsForm,
});

