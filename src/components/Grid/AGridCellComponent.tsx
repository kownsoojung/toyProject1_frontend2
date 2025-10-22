// src/components/Grid/AGridTextComponents.tsx
import { MenuItem, Select, SelectProps, TextField, TextFieldProps } from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { ICellRendererParams, ICellEditorParams } from "ag-grid-community";
import { SiteCodeDTO } from "@/api/generated";

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
export const AGridCellTextEditor = forwardRef((props: any, ref) => {
  const { value, onValueChange } = props;
  const [newValue, setNewValue] = useState(value || "");

  const textRef = useRef<HTMLInputElement>(null);

  // 🔹 Grid 가 getValue() 호출할 때 현재 값 반환
  useImperativeHandle(ref, () => ({
    getValue: () => newValue,
  }));

  // 🔹 mount 직후 focus
  useEffect(() => {
    textRef.current?.focus();
    //textRef.current?.select();
  }, []);

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setNewValue(newValue);
    onValueChange(newValue === '' ? null : newValue); // Pass null for empty string if desired
  };

  return (
    <TextField
      inputRef={textRef} 
      className="ag-mui-cell-editor"
      value={newValue}
      onChange={handleChange}  // ✅ 여기서만 setValue
      onKeyDown={(e) => {
        if (e.key === "Enter") props.stopEditing();      // ✅ props에서 호출
        if (e.key === "Escape") props.stopEditing(true);
      }}
      
      autoFocus
      fullWidth
      {...props.props}
      sx={{ height: "100%", ...props?.props?.sx }}
    />
  );
});


export const AGridCellSelectView = ({ params, props, codeItems }: { params: ICellRendererParams; props?: SelectProps; codeItems?:SiteCodeDTO[] }) => {
  

  let selectOptions:SiteCodeDTO[] = codeItems ?? [];


  const display = selectOptions.find(o => o.codeNumber === params.value)?.codeValue ?? params.value ?? "";

  return (
    <Select
      className="ag-mui-cell-editor"
      value={params.value ?? ""}
      fullWidth
      readOnly
      sx={{ height: "100%", ...props?.sx }}
      {...props}
      renderValue={() => {
        if(!display || display === "") {
          return "선택";
        }
        return display;
      }}
    >
      {selectOptions.map(opt => (
         <MenuItem key={opt.codeNumber} value={opt.codeNumber}>{opt.codeValue}</MenuItem>
      ))}
    </Select>
  );
};

// 편집용 에디터
export const AGridCellSelectEditor = forwardRef((props: any, ref) => {
  const { value, onValueChange } = props;
  const [newValue, setNewValue] = useState(value || "");
  const [open, setOpen] = useState(true); // 자동으로 드롭다운 열기
  const selectProps: SelectProps & { options?: SiteCodeDTO[] } = props.selectProps ?? {};
  const parentCode = props.parentCode ?? undefined;
  let selectOptions:SiteCodeDTO[] = props.codeItems ?? [];

  // 🔹 Grid 가 getValue() 호출할 때 현재 값 반환
  useImperativeHandle(ref, () => ({
    getValue: () => newValue,
    isCancelAfterEnd: () => false,
  }));

  if(parentCode) {
    selectOptions = selectOptions.filter(o => o.parentCodeNumber === parentCode);
  }

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setNewValue(newValue);
    onValueChange(newValue === '' ? null : newValue);
    setOpen(false); // 선택 후 드롭다운 닫기
  };
  
  return (
    <Select
      className="ag-mui-cell-editor"
      value={newValue}
      onChange={handleChange}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoFocus
      fullWidth
      displayEmpty
      renderValue={(selected) => {
        if (!selected || selected === "") {
          return "선택";
        }
        const option = selectOptions.find(opt => opt.codeNumber === selected);
        return option?.codeValue || selected;
      }}
      sx={{ height: "100%", ...selectProps.sx }}
      {...selectProps}
    > 
      <MenuItem key="" value="">선택</MenuItem>
      {selectOptions.map(opt => (
        <MenuItem key={opt.codeNumber} value={opt.codeNumber}>{opt.codeValue}</MenuItem>
      ))}
    </Select>
  );
});