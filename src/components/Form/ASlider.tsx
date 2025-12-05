import React from "react";
import { Slider, SliderProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

export interface ASliderProps extends Omit<SliderProps, "onChange" | "value"> {
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
  msize?: number | string;
  options?: SliderProps;
}

// 기본 Slider 컴포넌트 (순수 UI)
const ASliderBase: React.FC<ASliderProps> = ({
  value,
  onChange,
  msize = 0,
  options,
}) => {
  const { sx: optionSx, ...restOptions } = options || {};
  const hasFlex = (optionSx as any)?.flex !== undefined;

  return (
    <Slider
      value={value ?? 0}
      onChange={(_, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      sx={{
        ...(hasFlex ? {} : { width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)` }),
        ...(optionSx || {}),
      }}
      {...restOptions}
    />
  );
};

// Form 래퍼 컴포넌트
interface ASliderFormProps extends Omit<ASliderProps, "value" | "onChange"> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ASliderForm: React.FC<ASliderFormProps> = ({ name, base, ...props }) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field: any) => (
        <ASliderBase
          {...props}
          value={field.value}
          onChange={field.onChange}
          disabled={field.disabled}
        />
      )}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ASlider = Object.assign(ASliderBase, {
  Form: ASliderForm,
});
