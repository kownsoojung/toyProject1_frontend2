import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { useCommonCode, CommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

interface AutocompleteItemProps<T = CommonCode> {
  name: string;
  list?: T[];
  selectCode?: CodeSearchDTO;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  msize?: number | string;
  isDisabledOption?: (item: T) => boolean;
  parent?: string;
  placeholder?: string;
  label?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  options?: AutocompleteProps<T, boolean, boolean, boolean>;
}

export const AFormAutocomplete = <T extends CommonCode>({
  name,
  list = [],
  base,
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
}: AutocompleteItemProps<T>) => {
  const { control, setValue } = useFormContext();
  const parentValue = typeof parent === "string" ? useWatch({ control, name: parent }) : parent;

  // ✅ 공통 Hook으로 간단하게!
  const codeData = useCommonCode(codeType, selectCode);
  let selectOptions: T[] = (codeData as T[]) ?? list;

  if (parentValue) {
    selectOptions = selectOptions.filter(
      (item) => (item as any).parentValue === parentValue
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

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => {
        // field.value를 option 객체로 변환
        const selectedOption = selectOptions.find(
          (option) => finalGetOptionValue(option) === field.value
        ) || null;

        return (
          <Autocomplete
            
            options={selectOptions}
            value={selectedOption}
            onChange={(_event, newValue) => {
              const value = newValue ? finalGetOptionValue(newValue as T) : null;
              setValue(name, value);
              field.onChange(value);
            }}
            getOptionLabel={(option) => finalGetOptionLabel(option as T)}
            isOptionEqualToValue={(option, value) =>
              finalGetOptionValue(option) === finalGetOptionValue(value)
            }
            getOptionDisabled={isDisabledOption}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                label={label}
                error={!!error}
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
      }}
    </AFormBaseItem>
  );
};

