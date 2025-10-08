import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CodeItem, useCode } from "@/hooks/useCode";
import { SiteCodeSearchDTO } from "@/api/generated";
import { MenuItem, Select, SelectProps } from "@mui/material";

interface SelectItemProps extends Omit<SelectProps, "name">{
  name:string,
  options?: SiteCodeSearchDTO;
  list?: CodeItem[];
  selectCode?:SiteCodeSearchDTO;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  msize?:number|string
  isDisabledItem?: (item: CodeItem) => boolean;
  parent?: string | number; 
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
  ...rest
}) => {
  
  
  let selectOptions:CodeItem[];

  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    // codeData가 배열이면 map으로 변환
    selectOptions = codeData?.map(item => ({
      label: item.label ?? "",   // undefined일 경우 빈 문자열
      value: item.value ?? "", // undefined일 경우 빈 문자열
      parent: item.parent, 
      disabled: item.disabled ?? false, 
    })) ?? [];
  } else {
    selectOptions = list; // 기존 옵션 사용
  }

  if (parent) {
    selectOptions = selectOptions.filter(
      (item) => item.parent === parent
    );
  }

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <Select
          {...field}
          error={!!error}
          sx={{
            width: typeof msize === "string" && msize.includes("%") ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
          }}
          {...rest} // 여기서 select, multiline, rows 등 모두 전달 가능
        >
          {selectOptions.map((item:CodeItem) => (
            <MenuItem
              key={item.value}
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