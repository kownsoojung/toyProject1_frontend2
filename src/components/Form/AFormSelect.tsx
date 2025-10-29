import { CodeSearchDTO } from "@/api/generated";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

interface SelectItemProps {
  name:string,
  list?: CommonCode[];
  selectCode?:CodeSearchDTO;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  msize?:number|string
  isDisabledItem?: (item: CommonCode) => boolean;
  parent?: string; 
  options?:SelectProps
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  placeholder?: string; // "선택", "전체" 등
  placeholderValue?: string | number; // placeholder의 value (기본값: "") - 단일 선택용
  multiple?: boolean; // 다중 선택 여부
}

export const AFormSelect: React.FC<SelectItemProps> = ({
  name,
  options,
  list=[],
  base,
  selectCode,
  msize=0,
  isDisabledItem,
  parent,
  codeType="subCodeZip",
  placeholder="선택",
  placeholderValue = "",
  multiple = false
}) => {
  
  const { control, setValue } = useFormContext(); 
  let selectOptions: CommonCode[] = useCommonCode(codeType, selectCode) ?? list;

  const watchedParent = parent ? useWatch({ control, name: parent }) : undefined;
  const currentValue = useWatch({ control, name });
  const prevParentRef = useRef(watchedParent);

  // 초기 렌더링 시 값이 undefined이면 placeholderValue로 초기화
  useEffect(() => {
    if (currentValue === undefined) {
      const initialValue = multiple ? [] : placeholderValue;
      setValue(name, initialValue, { shouldValidate: false, shouldDirty: false });
    }
  }, []);

  // parent 값이 변경되면 현재 필드 초기화
  useEffect(() => {
    if (parent && prevParentRef.current !== watchedParent) {
      prevParentRef.current = watchedParent;
      const resetValue = multiple ? [] : placeholderValue;
      setValue(name, resetValue, { shouldValidate: false, shouldDirty: true });
    }
  }, [watchedParent, parent, name, setValue, placeholderValue, multiple]);

  // 현재 값이 옵션 목록에 없으면 초기화
  useEffect(() => {
    if (parent && currentValue && currentValue !== placeholderValue) {
      let isValidValue = false;
      
      if (multiple && Array.isArray(currentValue)) {
        // 다중 선택: 모든 값이 유효한지 확인
        isValidValue = currentValue.every(val => 
          selectOptions.some(item => item.value === val)
        );
      } else {
        // 단일 선택
        isValidValue = selectOptions.some(item => item.value === currentValue);
      }
      
      if (!isValidValue) {
        const resetValue = multiple ? [] : placeholderValue;
        setValue(name, resetValue, { shouldValidate: false, shouldDirty: true });
      }
    }
  }, [selectOptions, currentValue, parent, name, setValue, placeholderValue, multiple]);

  if (parent) {
    
    const parentValue = typeof parent === "string" ? watchedParent : (typeof parent === "number" ? parent : null);

    if (parentValue) {
      selectOptions = selectOptions.filter(
        (item) => item.parentValue == parentValue
      );
    }
    else {
      selectOptions = [];
    } 
  }

  return (
    <AFormBaseItem name={name} {...base} disabled={parent ? !watchedParent : false}>
      {(field, error) => (
        <Select
          displayEmpty
          fullWidth={msize === 0}
          multiple={multiple}
          {...field}
          value={field.value ?? (multiple ? [] : placeholderValue)}
          error={!!error}
          renderValue={(selected) => {
            // 다중 선택
            if (multiple && Array.isArray(selected)) {
              if (selected.length === 0) {
                return placeholder;
              }
              const labels = selected
                .map(val => selectOptions.find(item => item.value === val)?.label)
                .filter(Boolean)
                .join(', ');
              return labels || placeholder;
            }
            
            // 단일 선택
            if (!selected || selected === placeholderValue || selected === undefined) {
              return placeholder;
            }
            const selectedItem = selectOptions.find(item => item.value === selected);
            return selectedItem?.label || placeholder;
          }}
          sx={{
            width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
          }}
          {...options}
        >
          {placeholder && !multiple && (
            <MenuItem value={placeholderValue}>
              {placeholder}
            </MenuItem>
          )}
          {selectOptions.map((item: CommonCode) => (
            <MenuItem
              key={item.label}
              value={item.value}
              disabled={isDisabledItem?.(item) || item.disabled}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </AFormBaseItem>
  );
};

