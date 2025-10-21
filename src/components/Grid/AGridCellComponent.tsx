// src/components/Grid/AGridTextComponents.tsx
import { MenuItem, Select, SelectProps, TextField, TextFieldProps } from "@mui/material";
import { ICellRendererParams, ICellEditorParams, ICellEditorComp } from "ag-grid-community";
import { SiteCodeDTO } from "@/api/generated";

// ====================
// 1️⃣ 셀 컴포넌트 (렌더링 전용) - 편집 모드처럼 보이지만 읽기 전용
// ====================
export const AGridCellTextView = ({ params, props }: {params:ICellEditorParams, props?:TextFieldProps}) => {
  return (
    <TextField
      className="ag-mui-cell-editor"
      value={params.value || ""}
      fullWidth
      InputProps={{
        readOnly: true,
        ...props?.InputProps
      }}
      sx={{ 
        height: "100%",
        ...props?.sx,
        '& .MuiInputBase-input': {
          cursor: 'default',
        }
      }}
      {...props}
    />
  );
};

// ====================
// 2️⃣ 셀 에디터 (편집용) - ICellEditorComp 구현
// ====================
export class AGridCellTextEditor implements ICellEditorComp {
  private eInput!: HTMLInputElement;
  private selectAllOnEdit: boolean = false;

  init(params: ICellEditorParams) {
    const customParams = params as any;
    this.selectAllOnEdit = customParams.selectAllOnEdit ?? false;
    // MUI TextField 스타일 적용된 input 생성
    this.eInput = document.createElement('input');
    this.eInput.type = 'text';
    this.eInput.className = 'ag-mui-cell-editor';
    
    // MUI TextField와 동일한 스타일 적용
    Object.assign(this.eInput.style, {
      width: '100%',
      height: '28px',
      padding: '3px 8px',
      margin: '3px 0',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      fontSize: '13px',
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s'
    });

    // 포커스 시 MUI 스타일
    this.eInput.addEventListener('focus', () => {
      this.eInput.style.borderColor = '#1976d2';
      this.eInput.style.borderWidth = '2px';
      this.eInput.style.padding = '2px 7px'; // border 두께 증가 보정
    });

    this.eInput.addEventListener('blur', () => {
      this.eInput.style.borderColor = 'rgba(0, 0, 0, 0.23)';
      this.eInput.style.borderWidth = '1px';
      this.eInput.style.padding = '3px 8px';
    });

    // 초기값 설정
    let startValue = params.value;
    const eventKey = params.eventKey;
    const isBackspace = eventKey === 'Backspace';

    if (isBackspace) {
      startValue = '';
    } else if (eventKey && eventKey.length === 1) {
      startValue = eventKey;
    }

    if (startValue !== null && startValue !== undefined) {
      this.eInput.value = startValue;
    }
  }

  getGui(): HTMLElement {
    return this.eInput;
  }

  getValue(): any {
    return this.eInput.value;
  }

  afterGuiAttached(): void {
    this.eInput.focus();
    if (this.selectAllOnEdit) {
      this.eInput.select();  // 전체 선택
    } else {
      // 커서를 끝으로 이동
      this.eInput.setSelectionRange(this.eInput.value.length, this.eInput.value.length);
    }
  }

  destroy(): void {
    // Cleanup
  }

  isCancelAfterEnd(): boolean {
    return false;
  }
};


export const AGridCellSelectView = ({ params, props, parentColumn, codeItems }: { params: ICellRendererParams; props?: SelectProps; parentColumn?:any, codeItems?:SiteCodeDTO[] }) => {
  let selectOptions:SiteCodeDTO[] = codeItems || [];

  if (parentColumn) {
    selectOptions = parentColumn.data[parentColumn.colId]?.map((item:any) => item.codeNumber) ?? [];
  }

  const display = selectOptions.find(o => o.codeNumber === params.value)?.codeValue ?? params.value ?? "";

  return (
    <Select
      className="ag-mui-cell-editor"
      value={params.value ?? ""}
      fullWidth
      readOnly
      disabled={false}
      
      sx={{ 
        height: "100%", 
        ...props?.sx,
        '& .MuiSelect-select': {
          cursor: 'default',
        }
      }}
      {...props}
      renderValue={() => display}
    >
      {selectOptions.map(opt => (
         <MenuItem key={opt.codeNumber} value={opt.codeNumber}>{opt.codeValue}</MenuItem>
      ))}
    </Select>
  );
};

// 편집용 에디터 - 클래스 기반 ICellEditorComp 구현
export class AGridCellSelectEditor implements ICellEditorComp {
  private eSelect!: HTMLSelectElement;
  private value: any;

  init(params: any) {
    this.value = params.value ?? "";
    
    const selectOptions: SiteCodeDTO[] = params.codeItems ?? [];
    
    // Select 엘리먼트 생성
    this.eSelect = document.createElement('select');
    this.eSelect.className = 'ag-mui-cell-editor';
    
    // MUI Select 스타일 적용
    Object.assign(this.eSelect.style, {
      width: '100%',
      height: '28px',
      padding: '3px 8px',
      margin: '3px 0',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    });

    // 포커스 시 MUI 스타일
    this.eSelect.addEventListener('focus', () => {
      this.eSelect.style.borderColor = '#1976d2';
      this.eSelect.style.borderWidth = '2px';
      this.eSelect.style.padding = '2px 7px';
    });

    this.eSelect.addEventListener('blur', () => {
      this.eSelect.style.borderColor = 'rgba(0, 0, 0, 0.23)';
      this.eSelect.style.borderWidth = '1px';
      this.eSelect.style.padding = '3px 8px';
    });

    // 옵션 추가
    selectOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = String(opt.codeNumber ?? '');
      option.text = opt.codeValue ?? '';
      if (opt.codeNumber === this.value) {
        option.selected = true;
      }
      this.eSelect.appendChild(option);
    });

    // 변경 이벤트
    this.eSelect.addEventListener('change', (e) => {
      this.value = (e.target as HTMLSelectElement).value;
      // 선택 후 편집 종료
      params.stopEditing?.();
    });
  }

  getGui(): HTMLElement {
    return this.eSelect;
  }

  getValue(): any {
    return this.value;
  }

  afterGuiAttached(): void {
    this.eSelect.focus();
    // 자동으로 드롭다운 열기 (브라우저 지원 시)
    if ((this.eSelect as any).showPicker) {
      (this.eSelect as any).showPicker();
    }
  }

  destroy(): void {
    // Cleanup
  }

  isCancelAfterEnd(): boolean {
    return false;
  }
};