# AGrid 컴포넌트 사용 가이드

## 📋 개요

AGrid는 AG Grid를 기반으로 한 고급 데이터 그리드 컴포넌트입니다. 서버 페이지네이션, 로컬 데이터 모드, Excel 내보내기, 빠른 검색 등 다양한 기능을 제공합니다.

## 🚀 기본 사용법

### 1. 서버 데이터 모드 (기본)

```tsx
import { AFormGrid, AFormGridHandle } from '@/components/AFormItem/Grid/AGrid';
import { useRef } from 'react';

function MyComponent() {
  const gridRef = useRef<AFormGridHandle>(null);

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: '이름', width: 200 },
    { field: 'email', headerName: '이메일', width: 250 },
  ];

  const handleSearch = () => {
    gridRef.current?.refetch({ searchText: 'test' });
  };

  return (
    <AFormGrid
      ref={gridRef}
      url="/api/users"
      columnDefs={columnDefs}
      height={500}
      pageSize={20}
    />
  );
}
```

### 2. 로컬 데이터 모드

```tsx
const localData = [
  { id: 1, name: '홍길동', email: 'hong@example.com' },
  { id: 2, name: '김철수', email: 'kim@example.com' },
];

<AFormGrid
  rowData={localData}
  columnDefs={columnDefs}
  height={400}
/>
```

## 🎯 주요 기능

### 1. 선택된 행 가져오기

```tsx
const gridRef = useRef<AFormGridHandle>(null);

const handleGetSelected = () => {
  const selectedRows = gridRef.current?.getSelectedRows();
  console.log(selectedRows);
};

<AFormGrid
  ref={gridRef}
  url="/api/data"
  columnDefs={columnDefs}
  rowSelection="multiple"
  checkboxSelection={true}
  onSelectionChanged={(rows) => console.log('선택됨:', rows)}
/>
```

### 2. Excel / CSV 내보내기

```tsx
const handleExport = () => {
  gridRef.current?.exportToExcel('내보낸파일.xlsx');
  // 또는
  gridRef.current?.exportToCsv('내보낸파일.csv');
};

<Button onClick={handleExport}>Excel 다운로드</Button>
```

### 3. 빠른 검색 (Quick Filter)

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  showQuickFilter={true}
/>

// 또는 프로그래매틱하게
gridRef.current?.setQuickFilter('검색어');
```

### 4. 컬럼 표시/숨김

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  showColumnToggle={true}
/>

// 또는 프로그래매틱하게
gridRef.current?.setColumnVisible('email', false);
```

### 5. 행 이벤트 핸들러

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  onRowClicked={(data) => console.log('클릭:', data)}
  onRowDoubleClicked={(data) => console.log('더블클릭:', data)}
  onSelectionChanged={(rows) => console.log('선택 변경:', rows)}
/>
```

### 6. 행 드래그 & 드롭

```tsx
<AFormGrid
  rowData={localData}
  columnDefs={columnDefs}
  enableRowDrag={true}
  onRowDragEnd={(event) => {
    console.log('드래그 완료:', event);
    // 순서 재정렬 로직 처리
  }}
/>
```

### 7. 그룹화 기능

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  enableGrouping={true}
  gridOptions={{
    rowGroupPanelShow: 'always',
  }}
/>
```

### 8. 자동 높이 조절

```tsx
<AFormGrid
  rowData={localData}
  columnDefs={columnDefs}
  autoHeight={true}
/>
```

### 9. 에러 핸들링

```tsx
// 컴포넌트에서 자동으로 에러를 표시하고 재시도 버튼을 제공합니다
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
/>
```

## 📚 Props API

### 기본 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `url` | `string` | - | 서버 API URL (로컬 모드 시 생략 가능) |
| `columnDefs` | `ColDef[]` | - | AG Grid 컬럼 정의 |
| `height` | `number \| string` | `"400px"` | 그리드 높이 |
| `pageSize` | `number` | `10` | 페이지당 행 개수 |
| `rowName` | `string` | `"dataList"` | 응답에서 데이터 배열 키 |
| `totalName` | `string` | `"totalCnt"` | 응답에서 총 개수 키 |
| `rowSelection` | `"single" \| "multiple"` | `"single"` | 행 선택 모드 |
| `isPage` | `boolean` | `true` | 페이지네이션 표시 여부 |

### 새로운 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `rowData` | `any[]` | - | 로컬 데이터 (제공 시 서버 조회 안 함) |
| `autoFetch` | `boolean` | `true` | 마운트 시 자동 조회 여부 |
| `checkboxSelection` | `boolean` | `false` | 체크박스 선택 모드 |
| `showQuickFilter` | `boolean` | `false` | 빠른 검색창 표시 |
| `showColumnToggle` | `boolean` | `false` | 컬럼 표시/숨김 UI 표시 |
| `autoHeight` | `boolean` | `false` | 자동 높이 조절 |
| `enableRowDrag` | `boolean` | `false` | 행 드래그 활성화 |
| `enableGrouping` | `boolean` | `false` | 그룹화 기능 활성화 |
| `keepPageOnRefetch` | `boolean` | `false` | refetch 시 현재 페이지 유지 |

### 이벤트 핸들러 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `onRowClicked` | `(data: any) => void` | 행 클릭 시 |
| `onRowDoubleClicked` | `(data: any) => void` | 행 더블클릭 시 |
| `onSelectionChanged` | `(rows: any[]) => void` | 선택 변경 시 |
| `onRowDragEnd` | `(event: any) => void` | 드래그 종료 시 |

## 🔧 Handle API

```typescript
interface AFormGridHandle {
  refetch: (newParams?: Record<string, any>) => void;
  getRawData: () => Record<string, any>;
  getSelectedRows: () => any[];
  getGridApi: () => GridApi | undefined;
  exportToExcel: (fileName?: string) => void;
  exportToCsv: (fileName?: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  setQuickFilter: (text: string) => void;
  setColumnVisible: (field: string, visible: boolean) => void;
}
```

### 사용 예시

```tsx
const gridRef = useRef<AFormGridHandle>(null);

// 데이터 다시 불러오기
gridRef.current?.refetch({ status: 'active' });

// 선택된 행 가져오기
const selected = gridRef.current?.getSelectedRows();

// Excel 내보내기
gridRef.current?.exportToExcel('users.xlsx');

// 모두 선택
gridRef.current?.selectAll();

// 선택 해제
gridRef.current?.clearSelection();

// 빠른 검색
gridRef.current?.setQuickFilter('검색어');

// 컬럼 숨기기
gridRef.current?.setColumnVisible('email', false);

// AG Grid API 직접 접근
const api = gridRef.current?.getGridApi();
api?.sizeColumnsToFit();
```

## 💡 고급 사용 예시

### 완전한 CRUD 예시

```tsx
function UserManagement() {
  const gridRef = useRef<AFormGridHandle>(null);
  const [searchParams, setSearchParams] = useState({});

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: '이름', width: 150 },
    { field: 'email', headerName: '이메일', width: 200 },
    { field: 'status', headerName: '상태', width: 120 },
    {
      headerName: '작업',
      cellRenderer: (params: any) => (
        <Button onClick={() => handleEdit(params.data)}>수정</Button>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    setSearchParams(values);
    gridRef.current?.refetch(values);
  };

  const handleDelete = async () => {
    const selected = gridRef.current?.getSelectedRows();
    if (!selected?.length) {
      alert('삭제할 항목을 선택하세요');
      return;
    }
    
    // 삭제 API 호출
    await deleteUsers(selected.map(r => r.id));
    
    // 그리드 새로고침
    gridRef.current?.refetch(searchParams);
  };

  const handleExport = () => {
    gridRef.current?.exportToExcel(`users_${Date.now()}.xlsx`);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <Button onClick={handleSearch}>검색</Button>
        <Button onClick={handleDelete}>삭제</Button>
        <Button onClick={handleExport}>Excel 다운로드</Button>
      </Stack>

      <AFormGrid
        ref={gridRef}
        url="/api/users"
        columnDefs={columnDefs}
        height={600}
        pageSize={20}
        rowSelection="multiple"
        checkboxSelection={true}
        showQuickFilter={true}
        showColumnToggle={true}
        onRowDoubleClicked={(data) => handleEdit(data)}
        onSelectionChanged={(rows) => {
          console.log(`${rows.length}개 선택됨`);
        }}
      />
    </Box>
  );
}
```

## 🎨 스타일 커스터마이징

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  gridOptions={{
    rowHeight: 50,
    headerHeight: 60,
    getRowStyle: (params) => {
      if (params.data.status === 'inactive') {
        return { background: '#f0f0f0' };
      }
    },
  }}
/>
```

## 📝 서버 응답 포맷

기본적으로 다음 형식의 응답을 기대합니다:

```json
{
  "dataList": [
    { "id": 1, "name": "홍길동" },
    { "id": 2, "name": "김철수" }
  ],
  "totalCnt": 100
}
```

다른 형식을 사용하려면 `rowName`과 `totalName` props를 조정하세요:

```tsx
<AFormGrid
  url="/api/data"
  columnDefs={columnDefs}
  rowName="items"
  totalName="total"
/>
```

## ⚠️ 주의사항

1. **Excel Export**: AG Grid Enterprise 라이센스가 필요할 수 있습니다 (CSV는 무료)
2. **로컬 모드**: `rowData`를 제공하면 `url`은 무시됩니다
3. **autoFetch**: `false`로 설정하면 `refetch()`를 수동으로 호출해야 합니다
4. **페이지 유지**: `keepPageOnRefetch={true}`로 설정하면 검색 시 현재 페이지를 유지합니다

## 🔗 관련 문서

- [AG Grid 공식 문서](https://www.ag-grid.com/react-data-grid/)
- [Material-UI 문서](https://mui.com/)

