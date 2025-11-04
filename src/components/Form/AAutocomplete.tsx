import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { useCommonCode, CommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

interface AAutocompleteProps<T = CommonCode> {
  list?: T[];
  selectCode?: CodeSearchDTO;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  msize?: number | string;
  isDisabledOption?: (item: T) => boolean;
  parent?: string | number;
  placeholder?: string;
  label?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  options?: AutocompleteProps<T, boolean, boolean, boolean>;
  // 독립 사용을 위한 props
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  error?: boolean;
}

// 기본 Autocomplete 컴포넌트 (순수 UI)
const AAutocompleteBase = <T extends CommonCode>({
  list = [],
  selectCode,
  codeType,
  msize,
  isDisabledOption,
  parent,
  placeholder,
  label,
  getOptionLabel,
  getOptionValue,
  options,
  value,
  onChange,
  disabled = false,
  error = false,
}: AAutocompleteProps<T>) => {
  const codeData = useCommonCode(codeType, selectCode);
  let selectOptions: T[] = (codeData as T[]) ?? list;

  // parent 필터링 (독립 사용 시 parent는 number로 전달)
  if (parent && typeof parent === "number") {
    selectOptions = selectOptions.filter(
      (item) => (item as any).parentValue === parent
    );
  }

  // 기본 getOptionLabel: CommonCode의 label 사용
  const defaultGetOptionLabel = (option: T): string => {
    if (!option) return "";
    return (option as any).label || String(option);
  };

  // 기본 getOptionValue: CommonCode의 value 사용
  const defaultGetOptionValue = (option: T): any => {
    if (!option) return null;
    return (option as any).value ?? option;
  };

  const finalGetOptionLabel = getOptionLabel || defaultGetOptionLabel;
  const finalGetOptionValue = getOptionValue || defaultGetOptionValue;

  // value를 option 객체로 변환
  const selectedOption = selectOptions.find(
    (option) => finalGetOptionValue(option) === value
  ) || null;

  return (
    <Autocomplete
      options={selectOptions}
      value={selectedOption}
      onChange={(_event, newValue) => {
        if (onChange) {
          const newValueToSet = newValue ? finalGetOptionValue(newValue as T) : null;
          onChange(newValueToSet);
        }
      }}
      getOptionLabel={(option) => finalGetOptionLabel(option as T)}
      isOptionEqualToValue={(option, val) =>
        finalGetOptionValue(option) === finalGetOptionValue(val)
      }
      getOptionDisabled={isDisabledOption}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          label={label}
          error={error}
          sx={{
            width: typeof msize === "string"
              ? msize
              : msize === 0
                ? "100%"
                : `calc(100% - ${msize}px)`,
          }}
        />
      )}
      sx={{
        width: typeof msize === "string"
          ? msize
          : msize === 0
            ? "100%"
            : `calc(100% - ${msize}px)`,
      }}
      {...options}
    />
  );
};

// Form 래퍼 컴포넌트
interface AAutocompleteFormProps<T = CommonCode> extends Omit<AAutocompleteProps<T>, 'value' | 'onChange' | 'error' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const AAutocompleteForm = <T extends CommonCode>({
  name,
  base,
  parent,
  ...autocompleteProps
}: AAutocompleteFormProps<T>) => {
  const { control, setValue } = useFormContext();
  const parentValue = typeof parent === "string" ? useWatch({ control, name: parent }) : parent;

  // 공통 Hook으로 간단하게!
  const codeData = useCommonCode(autocompleteProps.codeType, autocompleteProps.selectCode);
  let selectOptions: T[] = (codeData as T[]) ?? (autocompleteProps.list || []);

  if (parentValue) {
    selectOptions = selectOptions.filter(
      (item) => (item as any).parentValue === parentValue
    );
  }

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <AAutocompleteBase<T>
          {...autocompleteProps}
          parent={parent}
          value={field.value}
          onChange={(val) => {
            setValue(name, val);
            field.onChange(val);
          }}
          error={!!error}
          disabled={field.disabled}
        />
      )}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const AAutocomplete = Object.assign(AAutocompleteBase, {
  Form: AAutocompleteForm,
});

