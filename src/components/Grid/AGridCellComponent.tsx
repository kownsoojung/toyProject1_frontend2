// src/components/Grid/AGridTextComponents.tsx
import { MenuItem, Select, SelectProps, TextField, TextFieldProps } from "@mui/material";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ICellRendererParams, ICellEditorParams } from "ag-grid-community";
import { useCode } from "@/hooks/useCode";
import { SiteCodeDTO, SiteCodeSearchDTO } from "@/api/generated";

// ====================
// 1️⃣ 셀 컴포넌트 (렌더링 전용)
// ====================
export const AGridCellTextView = ({ params, props }: {params:ICellEditorParams, props?:TextFieldProps}) => {
  return (
    <TextField
      className="ag-mui-cell-editor"
      value={params.value}
      fullWidth
      
      sx={{ height: "100%", ...props?.sx  }}
      {...props}
    />
  );
};

// ====================
// 2️⃣ 셀 에디터 (편집용)
// ====================
export const AGridCellTextEditor = forwardRef((params: any, ref) => {
  const [value, setValue] = useState(params.value || "");

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCancelAfterEnd: () => false,
  }));

  return (
    <TextField
      className="ag-mui-cell-editor"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
      fullWidth
      {...params.props}
      sx={{ height: "100%", ...params?.props?.sx }}
    />
  );
});


export const AGridCellSelectView = ({ params, props, codename, codeItems }: { params: ICellRendererParams; props?: SelectProps; codename?:SiteCodeSearchDTO, codeItems?:SiteCodeDTO[] }) => {
  

  let selectOptions:SiteCodeDTO[] = codeItems ?? [];
  
  if (codename) {
    const { data: codeData } = useCode(codename ?? "");
    selectOptions= codeData ?? [];
  }

  const display = selectOptions.find(o => o.codeNumber === params.value)?.label ?? params.value ?? "";

  return (
    <Select
      className="ag-mui-cell-editor"
      value={params.value ?? ""}
      fullWidth
      readOnly
      sx={{ height: "100%", ...props?.sx }}
      {...props}
      renderValue={() => display}
    >
      {selectOptions.map(opt => (
         <MenuItem key={opt.codeNumber} value={opt.codeNumber}>{opt.codeValue}</MenuItem>
      ))}
    </Select>
  );
};

// 편집용 에디터
export const AGridCellSelectEditor = forwardRef((params: any, ref) => {
  const [value, setValue] = useState(params.value ?? "");
  const props: SelectProps & { options?: SiteCodeDTO[] } = params.props ?? {};
  const codename = params.codename ?? undefined;
  let selectOptions:SiteCodeDTO[] = props.options ?? [];
  
  if (codename) {
    const { data: codeData } = useCode(codename);
    selectOptions= codeData ?? [];
  }

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCancelAfterEnd: () => false,
  }));

  
  return (
    <Select
      className="ag-mui-cell-editor"
      value={value}
      onChange={(e) => setValue((e.target as HTMLInputElement).value)}
      autoFocus
      fullWidth
      sx={{ height: "100%", ...props.sx }}
      {...props}
    >
      {selectOptions.map(opt => (
        <MenuItem key={opt.codeNumber} value={opt.codeNumber}>{opt.codeValue}</MenuItem>
      ))}
    </Select>
  );
});