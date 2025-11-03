import React from "react";
import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormGroup,
  FormControlLabelProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";

interface AFormSwitchProps {
  name: string;
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?: SwitchProps;
  labelOptions?: Omit<FormControlLabelProps, "control" | "label">;
}

export const AFormSwitch: React.FC<AFormSwitchProps> = ({
  name,
  selectCode,
  checkList = { label: "", value: "" },
  codeType,
  base,
  row = true,
  label,
  isDisabledItem,
  options,
  labelOptions
}) => {
  // ✅ 공통 Hook으로 간단하게!
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;

  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];

  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => {
        // ✅ 그룹 스위치 (여러 개)
        if (list && list.length > 1) {
          const value: (string | number)[] = field.value || [];

          const handleChange = (codeId: string | number) => {
            const newValue = value.includes(codeId)
              ? value.filter((v) => v !== codeId)
              : [...value, codeId];
            field.onChange(newValue);
          };

          return (
            <FormGroup row={row}>
              {list.map((item) => (
                <FormControlLabel
                  key={item.value}
                  control={
                    <Switch
                      checked={value.includes(item.value)}
                      onChange={() => handleChange(item.value)}
                      disabled={isDisabledItem?.(item) || false}
                      {...options}
                    />
                  }
                  label={item.label}
                  labelPlacement="start"
                  sx={{ marginRight:0, gap: 0 }}
                  {...labelOptions}
                />
              ))}
            </FormGroup>
          );
        }

        // ✅ 단일 스위치
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                {...options}
              />
            }
            label={label || list[0]?.label || ""}
            labelPlacement="start"
            sx={{ marginRight:0, gap: 0 }}
            {...labelOptions}
          />
        );
      }}
    </AFormBaseItem>
  );
};

