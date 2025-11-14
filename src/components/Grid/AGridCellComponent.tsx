// src/components/Grid/AGridTextComponents.tsx
import { MenuItem, Select, SelectProps, TextField, TextFieldProps } from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { ICellRendererParams, ICellEditorParams } from "ag-grid-community";
import { CommonCode } from "@/hooks";

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


export const AGridCellSelectView = ({ params, props, codeItems }: { params: ICellRendererParams; props?: SelectProps; codeItems?:CommonCode[] }) => {
  

  let selectOptions:CommonCode[] = codeItems ?? [];


  const display = selectOptions.find(o => o.value == params.value)?.label ?? params.value ?? "";

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
         <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </Select>
  );
};

// 편집용 에디터
export const AGridCellSelectEditor = forwardRef((props: any, ref) => {
  const { value, onValueChange } = props;
  const [newValue, setNewValue] = useState(value || "");
  const [open, setOpen] = useState(true); // 자동으로 드롭다운 열기
  const selectProps: SelectProps & { options?: CommonCode[] } = props.selectProps ?? {};
  const parentCode = props.parentCode ?? undefined;
  let selectOptions:CommonCode[] = props.codeItems ?? [];
  const originalType = typeof value;
  // 🔹 Grid 가 getValue() 호출할 때 현재 값 반환
  useImperativeHandle(ref, () => ({
    getValue: () => {
      // ✅ 핵심: 원본 타입으로 자동 변환
      if (originalType === 'number') {
        return Number(newValue);
      }
      if (originalType === 'boolean') {
        return newValue === 'true' || newValue === true;
      }
      return newValue;  // string은 그대로
    },
    isCancelAfterEnd: () => false,
    isCancelBeforeStart: () => false,
  }));

  if(parentCode) {
    selectOptions = selectOptions.filter(o => o.parentValue == parentCode);
  }

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    let convertedValue = newValue;
    if (originalType === 'number') {
      convertedValue = Number(newValue);
    } else if (originalType === 'boolean') {
      convertedValue = newValue === 'true' || newValue === true;
    }
    setNewValue(convertedValue);
    onValueChange(convertedValue === '' ? null : convertedValue);

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
        const option = selectOptions.find(opt => opt.value == selected);
        return option?.label || selected;
      }}
      sx={{ height: "100%", ...selectProps.sx }}
      {...selectProps}
    > 
      <MenuItem key="" value="">선택</MenuItem>
      {selectOptions.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </Select>
  );
});