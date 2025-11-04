import { CodeSearchDTO } from "@/api/generated";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface ASelectProps {
  list?: CommonCode[];
  selectCode?: CodeSearchDTO;
  msize?: number | string;
  isDisabledItem?: (item: CommonCode) => boolean;
  parent?: string | number;
  options?: SelectProps;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  placeholder?: string;
  placeholderValue?: string | number;
  isPlaceholder?: boolean;
  multiple?: boolean;
  // 독립 사용을 위한 props
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

// 기본 Select 컴포넌트 (순수 UI)
const ASelectBase: React.FC<ASelectProps> = ({
  list = [],
  selectCode,
  msize = 0,
  isDisabledItem,
  parent,
  codeType = "subCodeZip",
  placeholder = "선택",
  placeholderValue = "",
  isPlaceholder = true,
  multiple = false,
  value,
  onChange,
  disabled = false,
  error = false,
  fullWidth,
  options,
}) => {
  let selectOptions: CommonCode[] = useCommonCode(codeType, selectCode) ?? list;

  // parent 필터링 (독립 사용 시 parent는 number로 전달)
  if (parent && typeof parent === "number") {
    selectOptions = selectOptions.filter(
      (item) => item.parentValue == parent as any
    );
  }

  const selectValue = value ?? (multiple ? [] : placeholderValue);

  return (
    <Select
      displayEmpty
      fullWidth={fullWidth ?? (msize === 0)}
      multiple={multiple}
      value={selectValue}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value as any);
        }
      }}
      error={error}
      disabled={disabled}
      renderValue={(selected) => {
        // 다중 선택
        if (multiple && Array.isArray(selected)) {
          if (selected.length === 0) {
            return isPlaceholder ? placeholder : "";
          }
          const labels = selected
            .map(val => selectOptions.find(item => item.value === val)?.label)
            .filter(Boolean)
            .join(', ');
          return labels || (isPlaceholder ? placeholder : "");
        }
        
        // 단일 선택
        const isPlaceholderValue = selected === null || selected === undefined || selected === placeholderValue;
        
        if (isPlaceholderValue) {
          return isPlaceholder ? placeholder : "";
        }
        
        const selectedItem = selectOptions.find(item => item.value === selected);
        return selectedItem?.label || (isPlaceholder ? placeholder : "");
      }}
      sx={{
        width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
      }}
      {...options}
    >
      {isPlaceholder && placeholder && !multiple && (
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
  );
};

// Form 래퍼 컴포넌트
interface ASelectFormProps extends Omit<ASelectProps, 'value' | 'onChange' | 'error' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ASelectForm: React.FC<ASelectFormProps> = ({
  name,
  base,
  parent,
  placeholderValue = "",
  multiple = false,
  ...selectProps
}) => {
  const { control, setValue } = useFormContext();
  let selectOptions: CommonCode[] = useCommonCode(selectProps.codeType, selectProps.selectCode) ?? (selectProps.list || []);

  const watchedParent = parent ? useWatch({ control, name: parent as string }) : undefined;
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
        isValidValue = currentValue.every(val => 
          selectOptions.some(item => item.value === val)
        );
      } else {
        isValidValue = selectOptions.some(item => item.value === currentValue);
      }
      
      if (!isValidValue) {
        const resetValue = multiple ? [] : placeholderValue;
        setValue(name, resetValue, { shouldValidate: false, shouldDirty: true });
      }
    }
  }, [selectOptions, currentValue, parent, name, setValue, placeholderValue, multiple]);

  // parent 필터링
  if (parent) {
    const parentValue = typeof parent === "string" ? watchedParent : (typeof parent === "number" ? parent : null);
    if (parentValue) {
      selectOptions = selectOptions.filter(
        (item) => item.parentValue == parentValue
      );
    } else {
      selectOptions = [];
    }
  }

  return (
    <AFormBaseItem name={name} {...base} disabled={parent ? !watchedParent : false || base?.disabled}>
      {(field, error) => (
        <ASelectBase
          {...selectProps}
          parent={parent}
          value={field.value ?? (multiple ? [] : placeholderValue)}
          onChange={field.onChange}
          error={!!error}
          disabled={field.disabled}
        />
      )}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ASelect = Object.assign(ASelectBase, {
  Form: ASelectForm,
});

