// src/components/Grid/AGridTextComponents.tsx
import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ICellRendererParams, ICellEditorParams } from "ag-grid-community";

// ====================
// 1️⃣ 셀 컴포넌트 (렌더링 전용)
// ====================
export const AGridTextView = ({ params, props }: {params:ICellEditorParams, props?:TextFieldProps}) => {
  return (
    <TextField
      value={params.value}
      fullWidth
      sx={{ height: "100%" }}
      {...props}
    />
  );
};

// ====================
// 2️⃣ 셀 에디터 (편집용)
// ====================
export const AGridTextEditor = forwardRef(
  ({ props, initialValue }: { props?: TextFieldProps; initialValue?: string }, ref) => {
    const [value, setValue] = useState(initialValue || "");

    // AG Grid가 셀 에디터에서 호출하는 메서드들
    useImperativeHandle(ref, () => ({
      getValue: () => value, // 편집 완료 시 반환할 값
      isCancelAfterEnd: () => false, // 편집 취소 여부
      // 필요하면 아래 메서드도 구현 가능
      // afterGuiAttached: () => { ... },
      // focusIn: () => { ... },
    }));

    return (
      <TextField
      className="ag-grid-text-editor"

        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        fullWidth
        {...props}
        sx={{ height: "100%" }}
      />
    );
  }
);

// ====================
// 3️⃣ 사용 예시 (columnDefs)
// ====================
// const columnDefs = [
//   {
//     field: "name",
//     headerName: "Name",
//     editable: true,
//     cellRenderer: AGridTextCell, // 기본 표시용
//     cellEditor: AGridTextEditor, // 편집용
//   },
// ];
