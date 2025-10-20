import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { useCode } from "@/hooks/useCode";
import { SiteCodeDTO, SiteCodeSearchDTO } from "@/api/generated";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

interface SelectItemProps extends Omit<SelectProps, "name">{
  name:string,
  list?: SiteCodeDTO[];
  selectCode?:SiteCodeSearchDTO;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  msize?:number|string
  isDisabledItem?: (item: SiteCodeDTO) => boolean;
  parent?: string; 
  options?:SelectProps
}

export const AFormSelect: React.FC<SelectItemProps> = ({
  name,
  options,
  list=[],
  base,
  selectCode,
  msize,
  isDisabledItem,
  parent,
}) => {
  
  const { control } = useFormContext(); 
  const parentValue = typeof parent === "string" ? useWatch({ control, name: parent }) : parent;


  let selectOptions:SiteCodeDTO[];

  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    // codeData가 배열이면 map으로 변환
    selectOptions = codeData ?? [];
  } else {
    selectOptions = list; // 기존 옵션 사용
  }

  if (parentValue) {
    selectOptions = selectOptions.filter(
      (item) => item.parentCodeNumber === parent
    );
  }

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <Select
          {...field}
          error={!!error}
          sx={{
            width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
          }}
          {...options}
        >
          {selectOptions.map((item:SiteCodeDTO) => (
            <MenuItem
              key={item.codeNumber}
              value={item.codeValue}
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

