import React from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";

interface baseProp  {
  name:string
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?:RadioProps
}

export const AFormRadio: React.FC<baseProp> = ({
  name,
  selectCode,
  checkList,
  codeType,
  base,
  row = true,
  isDisabledItem,
  options
}) => {

  // ✅ 공통 Hook으로 간단하게!
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;

  const list: CommonCode[] = finalCheckList ? Array.isArray(finalCheckList) ? finalCheckList: [finalCheckList]: [];

  return (
  <AFormBaseItem name={name} {...base}>
    {(field) => {

      return (
        <RadioGroup
          row={row}
          value={field.value ?? ""}       // field.value를 그룹 value로 설정
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

