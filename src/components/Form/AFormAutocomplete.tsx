import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { useCode } from "@/hooks/useCode";
import { SiteCodeDTO, SiteCodeSearchDTO } from "@/api/generated";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

interface AutocompleteItemProps<T = SiteCodeDTO> {
  name: string;
  list?: T[];
  selectCode?: SiteCodeSearchDTO;
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

export const AFormAutocomplete = <T extends SiteCodeDTO>({
  name,
  list = [],
  base,
  selectCode,
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

  let selectOptions: T[];

  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    selectOptions = (codeData as T[]) ?? [];
  } else {
    selectOptions = list;
  }

  if (parentValue) {
    selectOptions = selectOptions.filter(
      (item) => (item as any).parentCodeNumber === parentValue
    );
  }

  // 기본 getOptionLabel: SiteCodeDTO의 label 또는 codeValue 사용
  const defaultGetOptionLabel = (option: T): string => {
    if (!option) return "";
    return (option as any).label || (option as any).codeValue || String(option);
  };

  // 기본 getOptionValue: SiteCodeDTO의 codeNumber 사용
  const defaultGetOptionValue = (option: T): any => {
    if (!option) return null;
    return (option as any).codeNumber ?? option;
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
            onChange={(event, newValue) => {
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

