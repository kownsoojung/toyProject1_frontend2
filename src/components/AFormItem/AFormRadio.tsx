import React from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  RadioProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CodeItem, useCode } from "@/hooks/useCode";

interface baseProp  {
  name:string
  selectCode?: SiteCodeSearchDTO;
  checkList?: CodeItem[] | CodeItem;
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CodeItem) => boolean;
  options?:RadioProps
}

export const AFormRadio: React.FC<baseProp> = ({
  name,
  selectCode,
  checkList,
  base,
  row = true,
  isDisabledItem,
  options
}) => {

  
  // ✅ 선택 코드 훅으로 자동 checkList 가져오기 (있으면)
  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    // codeData가 배열이면 map으로 변환
    checkList = codeData?.map(item => ({
      label: item.label ?? "",   // undefined일 경우 빈 문자열
      value: item.value ?? "", // undefined일 경우 빈 문자열
      parent: item.parent,
      disabled:false
    })) ?? [];
  } 

  const list: CodeItem[] = checkList ? Array.isArray(checkList) ? checkList: [checkList]: [];

  return (
  <AFormBaseItem name={name} {...base}>
    {(field, error) => {

      return (
        <RadioGroup
          row={row}
          value={field.value || ""}       // field.value를 그룹 value로 설정
          onChange={(e) => field.onChange(e.target.value)}
        >
          {list.map((item) => (
            <FormControlLabel
              key={item.value}
              value={item.value}          // RadioGroup value와 매칭
              control={<Radio disabled={isDisabledItem?.(item) || item.disabled} {...options} />}
              label={item.label}
            />
          ))}
        </RadioGroup>
      );
    }}
  </AFormBaseItem>
);
};
