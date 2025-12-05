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

  // 독립 사용
  value?: string | number | (string | number)[];
  changeCallback?: (value: any, event?: any) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  firstIndex?: number;
}

/* -------------------------------------------------------------------------- */
/*                                   BASE UI                                  */
/* -------------------------------------------------------------------------- */

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
  /** 1) list 우선, 없으면 useCommonCode 사용 */
  let selectOptions = list.length > 0 ? list : (useCommonCode(codeType, selectCode) ?? []);

  /** 2) parent 필터 */
  if (list.length === 0 && parent != null && parent !== "") {
    selectOptions = selectOptions.filter((item) =>
      String(item.parentValue ?? "") === String(parent)
    );
  }

  /** 3) value fallback 정의 */
  const finalValue =
    value ??
    (multiple
      ? []
      : selectOptions[firstIndex]?.value ?? placeholderValue);

  /** 4) 렌더 값 표시 */
  const renderValue = (selected: any) => {
    if (multiple && Array.isArray(selected)) {
      if (selected.length === 0) return isPlaceholder ? placeholder : "";

      return selected
        .map((v) => {
          const item = selectOptions.find(
            (o) => String(o.value) === String(v)
          );
          return item?.label ?? v;
        })
        .join(", ");
    }

    if (selected === placeholderValue) {
      return isPlaceholder ? placeholder : "";
    }

    const item = selectOptions.find(
      (o) => String(o.value) === String(selected)
    );
    return item?.label ?? (isPlaceholder ? placeholder : "");
  };

  return (
    <Select
      displayEmpty
      multiple={multiple}
      value={finalValue}
      onChange={(e) => changeCallback?.(e.target.value, e)}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth ?? msize === 0}
      renderValue={renderValue}
      sx={{
        width:
          typeof msize === "string"
            ? msize
            : msize === 0
            ? "100%"
            : `calc(100% - ${msize}px)`,
      }}
      {...options}
    >
      {isPlaceholder && !multiple && (
        <MenuItem value={placeholderValue}>{placeholder}</MenuItem>
      )}

      {selectOptions.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          disabled={isDisabledItem?.(item) || item.disabled}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 FORM WRAPPER                               */
/* -------------------------------------------------------------------------- */

interface ASelectFormProps
  extends Omit<ASelectProps, "value" | "changeCallback" | "error" | "disabled"> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  changeCallback?: ASelectProps["changeCallback"];
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

  const allOptions =
    useCommonCode(selectProps.codeType, selectProps.selectCode) ??
    (selectProps.list || []);

  const watchedParent = parent
    ? useWatch({ control, name: parent as string })
    : undefined;

  const prevParentRef = useRef(watchedParent);
  const initialSetRef = useRef(false);

  /** parent가 있으면 parent 기반 필터링 */
  const selectOptions = useMemo(() => {
    if (!parent) return allOptions;

    const pval =
      typeof parent === "string" ? watchedParent : parent;

    if (
      pval === null ||
      pval === undefined ||
      pval === "" ||
      pval === placeholderValue
    ) {
      return [];
    }

    return allOptions.filter(
      (item) => String(item.parentValue ?? "") === String(pval)
    );
  }, [allOptions, watchedParent, parent, placeholderValue]);

  /** 1) 첫 로딩시에 firstIndex 값 자동 세팅 */
  useEffect(() => {
    if (!initialSetRef.current && firstIndex != null) {
      const first = selectOptions[firstIndex];
      if (first) {
        const current = getValues(name);
        if (!current || current === placeholderValue) {
          setValue(name, first.value, {
            shouldDirty: false,
            shouldValidate: false,
          });
        }
      }
      initialSetRef.current = true;
    }
  }, [selectOptions, firstIndex, name, setValue, placeholderValue, getValues]);

  /** 2) parent 변경 시 값 초기화 */
  useEffect(() => {
    if (!parent) return;

    if (prevParentRef.current !== watchedParent) {
      prevParentRef.current = watchedParent;
      initialSetRef.current = false;

      setValue(name, multiple ? [] : placeholderValue, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [watchedParent, parent, name, setValue, multiple, placeholderValue]);

  return (
    <AFormBaseItem
      name={name}
      {...base}
      disabled={parent ? !watchedParent : base?.disabled}
    >
      {(field, error) => (
        <ASelectBase
          {...selectProps}
          parent={parent}
          value={field.value}
          changeCallback={(val, e) => {
            field.onChange(val);
            changeCallback?.(val, e);
          }}
          error={!!error}
          disabled={field.disabled}
          list={selectOptions}
        />
      )}
    </AFormBaseItem>
  );
};

export const ASelect = Object.assign(ASelectBase, {
  Form: ASelectForm,
});
