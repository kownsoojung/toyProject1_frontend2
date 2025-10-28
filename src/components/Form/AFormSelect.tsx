import { CodeSearchDTO } from "@/api/generated";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

interface SelectItemProps extends Omit<SelectProps, "name">{
  name:string,
  list?: CommonCode[];
  selectCode?:CodeSearchDTO;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  msize?:number|string
  isDisabledItem?: (item: CommonCode) => boolean;
  parent?: string|number; 
  options?:SelectProps
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
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
  codeType="subCodeZip"
}) => {
  
  const { control } = useFormContext(); 
  
  // ✅ useWatch는 항상 호출 (Hooks 규칙) - parent가 없으면 빈 문자열로 watch
  const watchedParent = useWatch({ 
    control, 
    name: typeof parent === "string" ? parent : name  // parent 없으면 자기 자신을 watch (사용 안 함)
  });
  
  // parent가 문자열이면 watch된 값, 숫자면 그대로, undefined면 null
  const parentValue = typeof parent === "string" ? watchedParent : (typeof parent === "number" ? parent : null);

  // ✅ 공통 Hook으로 간단하게!
  let selectOptions: CommonCode[] = useCommonCode(codeType, selectCode) ?? list;

  if (parentValue) {
    selectOptions = selectOptions.filter(
      (item) => item.parentValue == parentValue
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

