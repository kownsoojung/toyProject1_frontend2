import React from "react";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

import { Checkbox, CheckboxProps } from "@mui/material";

interface AFormCheckboxProps extends Omit<CheckboxProps, "name" | "onChange" | "checked">, Omit<AFormBaseItemProps, "children"> {}

export const AFormCheckbox: React.FC<AFormCheckboxProps> = ({
  name,
  disabled = false,
  ...rest
}) => {

  return (
    <AFormBaseItem name={name} {...rest}>
      {(field, error) => (
        <Checkbox
          
          {...rest}
          
        />
      )}
    </AFormBaseItem>
  );
};
