import React, { useState, useEffect } from "react";
import { AFormSelect } from "./AFormSelect";
import { Form } from "antd";
import { SiteCodeSearchDTO } from "@/api/generated";
import { CodeItem, useCode } from "@/hooks/useCode";

interface ChainSelectItem {
  name: string; // Form field name
  label: string;
  selectCode: SiteCodeSearchDTO; // API 조회용
}

interface ChainSelectProps {
  items: ChainSelectItem[];
}

/**
 * Lazy Load 기반 유동 단계 체인드 셀렉트
 */
export const AFormChainSelect: React.FC<ChainSelectProps> = ({ items }) => {
  const form = Form.useFormInstance();
  const [values, setValues] = useState<(string | undefined)[]>(
    Array(items.length).fill(undefined)
  );

  const handleChange = (level: number, value: string) => {
    const newValues = [...values];
    newValues[level] = value;

    // 하위 단계 초기화
    for (let i = level + 1; i < newValues.length; i++) {
      newValues[i] = undefined;
      form.setFieldValue(items[i].name, undefined);
    }

    setValues(newValues);
    form.setFieldValue(items[level].name, value);
  };

  // 단계별 options 조회
  const optionsList: CodeItem[][] = items.map((item, i) => {
    const parentValue = i === 0 ? undefined : values[i - 1];
    const { data } = useCode(item.selectCode);
    return data?.map((d) => ({ label: d.label ?? "", value: d.value ?? "" })) ?? [];
  });

  return (
    <>
      {items.map((item, i) => (
        <AFormSelect
          key={item.name}
          name={item.name}
          label={item.label}
          options={optionsList[i]}
          disabled={i > 0 && !values[i - 1]} // 상위 선택 없으면 disable
          props={{ onChange :(val) => handleChange(i, val as string)}}
        />
      ))}
    </>
  );
};
