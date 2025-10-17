import React from "react";
import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CodeItem, useCode } from "@/hooks/useCode";
import { SiteCodeSearchDTO } from "@/api/generated";

interface AFormSwitchProps {
  name: string;
  selectCode?: SiteCodeSearchDTO;
  checkList?: CodeItem[] | CodeItem;
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CodeItem) => boolean;
  options?: SwitchProps;
}

export const AFormSwitch: React.FC<AFormSwitchProps> = ({
  name,
  selectCode,
  checkList = { label: "", value: "" },
  base,
  row = true,
  label,
  isDisabledItem,
  options
}) => {
  // ✅ 선택 코드 훅으로 자동 checkList 가져오기 (있으면)
  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    checkList = codeData?.map(item => ({
      label: item.label ?? "",
      value: item.value ?? "",
      disabled: false
    })) ?? [];
  }

  const list = Array.isArray(checkList) ? checkList : [checkList];

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => {
        // ✅ 그룹 스위치 (여러 개)
        if (list && list.length > 1) {
          const value: string[] = field.value || [];

          const handleChange = (codeId: string) => {
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
          />
        );
      }}
    </AFormBaseItem>
  );
};

