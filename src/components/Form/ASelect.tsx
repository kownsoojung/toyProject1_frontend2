// src/components/Form/ASelect.tsx
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef, useMemo } from "react";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CodeSearchDTO, CommonCode, commonCodeType } from "@/types";
import { useCommonCode } from "@/hooks";


interface ASelectProps {
  list?: CommonCode[];
  selectCode?: CodeSearchDTO;
  msize?: number | string;
  isDisabledItem?: (item: CommonCode) => boolean;
  parent?: string | number;
  options?: SelectProps;
  codeType?: commonCodeType;
  placeholder?: string;
  placeholderValue?: string | number;
  isPlaceholder?: boolean;
  multiple?: boolean;
  // 독립 사용을 위한 props
  value?: string | number | (string | number)[];
  changeCallback?: (value: string | number | (string | number)[], event?: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  firstIndex?: number;
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
  changeCallback,
  disabled = false,
  error = false,
  fullWidth,
  options,
  firstIndex = 0,
}) => {
  // ⭐ list가 있으면 우선 사용 (이미 필터링된 옵션), 없으면 useCommonCode 사용
  let selectOptions: CommonCode[] = list.length > 0 ? list : (useCommonCode(codeType, selectCode) ?? []);

  // ⭐ parent 필터링 (독립 사용 시 parent는 number로 전달, list가 없을 때만)
  if (list.length === 0 && parent && typeof parent === "number") {
    selectOptions = selectOptions.filter(
      (item) => {
        const itemParentValue = item.parentValue != null ? String(item.parentValue) : "";
        return itemParentValue === String(parent);
      }
    );
  }

  const selectValue = value ?? (multiple ? [] : firstIndex ? selectOptions[firstIndex].value : placeholderValue);

  return (
    <Select
      displayEmpty
      fullWidth={fullWidth ?? (msize === 0)}
      multiple={multiple}
      value={selectValue}
      onChange={(e) => {
        if (changeCallback) {
          changeCallback(e.target.value as any, e as React.ChangeEvent<{ name?: string; value: unknown }>);
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
            .map(val => selectOptions.find(item => {
              // 값 비교 시 타입 변환 고려
              return String(item.value) === String(val) || item.value === val;
            })?.label)
            .filter(Boolean)
            .join(', ');
          return labels || (isPlaceholder ? placeholder : "");
        }
        
        // 단일 선택
        const isPlaceholderValue = selected === null || selected === undefined || selected === placeholderValue;
        
        if (isPlaceholderValue) {
          return isPlaceholder ? placeholder : "";
        }
        
        // ✅ 옵션 목록에서 값 찾기 (코드 리스트가 로드된 후에도 동작)
        // 타입 변환을 고려하여 값 비교
        const selectedItem = selectOptions.find(item => {
          return String(item.value) === String(selected) || item.value === selected;
        });
        
        // ✅ 값이 옵션에 있으면 label 표시, 없어도 일단 값 표시 (코드 리스트 로딩 대기)
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
interface ASelectFormProps extends Omit<ASelectProps, 'value' | 'changeCallback' | 'error' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  changeCallback?: (value: string | number | (string | number)[], event?: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

const ASelectForm: React.FC<ASelectFormProps> = ({
  name,
  base,
  parent,
  placeholderValue = "",
  firstIndex,
  multiple = false,
  changeCallback,
  ...selectProps
}) => {
  const { control, setValue, getValues } = useFormContext();
  const allSelectOptions: CommonCode[] = useCommonCode(selectProps.codeType, selectProps.selectCode) ?? (selectProps.list || []);
  const watchedParent = parent ? useWatch({ control, name: parent as string }) : undefined;
  const prevParentRef = useRef(watchedParent);
  const initializedRef = useRef(false);

  const selectOptions = useMemo(() => {
    if (!parent) return allSelectOptions;
    const parentValue = typeof parent === "string" ? watchedParent : parent;
    if (parentValue !== null && parentValue !== undefined && parentValue !== "" && parentValue !== placeholderValue) {
      return allSelectOptions.filter(
        (item) => String(item.parentValue ?? "") === String(parentValue)
      );
    }
    return [];
  }, [allSelectOptions, parent, watchedParent, placeholderValue]);

  // ✅ 처음 한 번만 firstIndex로 값 세팅
  useEffect(() => {
    if (!initializedRef.current && firstIndex != null && selectOptions[firstIndex]) {
      initializedRef.current = true;
      const current = getValues(name);
      if (!current || current === placeholderValue) {
        setValue(name, selectOptions[firstIndex].value, { shouldValidate: false, shouldDirty: false });
      }
    }
  }, [selectOptions, firstIndex, name, setValue, placeholderValue, getValues]);

  // ✅ parent가 바뀌면 필드 초기화
  useEffect(() => {
    if (parent && prevParentRef.current !== watchedParent) {
      prevParentRef.current = watchedParent;
      const resetValue = multiple ? [] : placeholderValue;
      setValue(name, resetValue, { shouldValidate: false, shouldDirty: true });
      initializedRef.current = false; // 다음 parent 선택 시 다시 초기화 가능하도록
    }
  }, [watchedParent, parent, name, setValue, placeholderValue, multiple]);

  return (
    <AFormBaseItem name={name} {...base} disabled={parent ? !watchedParent : base?.disabled}>
      {(field, error) => {
        const handleChange = (val: any, e?: React.ChangeEvent<{ name?: string; value: unknown }>) => {
          field.onChange(val);
          changeCallback?.(val, e);
        };

        return (
          <ASelectBase
            {...selectProps}
            parent={parent}
            value={field.value}
            changeCallback={handleChange}
            error={!!error}
            disabled={field.disabled}
            list={selectOptions}
          />
        );
      }}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ASelect = Object.assign(ASelectBase, {
  Form: ASelectForm,
});
