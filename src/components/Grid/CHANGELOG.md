# AGrid 컴포넌트 개선 내역

## 🎉 새로운 기능

### ✅ 1. 선택된 행 관리
- **getSelectedRows()**: 선택된 행 데이터 가져오기
- **clearSelection()**: 선택 해제
- **selectAll()**: 모두 선택
- **onSelectionChanged**: 선택 변경 이벤트 핸들러

```tsx
const selected = gridRef.current?.getSelectedRows();
gridRef.current?.selectAll();
gridRef.current?.clearSelection();
```

### ✅ 2. GridApi 직접 접근
- **getGridApi()**: AG Grid API 직접 제어 가능

```tsx
const api = gridRef.current?.getGridApi();
api?.sizeColumnsToFit();
api?.showLoadingOverlay();
```

### ✅ 3. Excel / CSV Export
- **exportToExcel()**: Excel 파일로 내보내기
- **exportToCsv()**: CSV 파일로 내보내기

```tsx
gridRef.current?.exportToExcel('report.xlsx');
gridRef.current?.exportToCsv('data.csv');
```

### ✅ 4. 로컬 데이터 모드
- **rowData** prop: 서버 없이 로컬 데이터 사용
- 클라이언트 사이드 페이지네이션 자동 지원

```tsx
<AFormGrid rowData={localData} columnDefs={columnDefs} />
```

### ✅ 5. 자동 조회 제어
- **autoFetch** prop: 초기 자동 조회 여부 설정 (기본: true)
- **keepPageOnRefetch** prop: refetch 시 현재 페이지 유지

```tsx
<AFormGrid autoFetch={false} keepPageOnRefetch={true} />
```

### ✅ 6. 에러 핸들링 UI
- 에러 발생 시 자동으로 Alert 표시
- 재시도 버튼 제공
- 사용자 친화적인 에러 메시지

### ✅ 7. 체크박스 선택 모드
- **checkboxSelection** prop: 첫 번째 컬럼에 체크박스 자동 추가
- 헤더 체크박스로 전체 선택/해제

```tsx
<AFormGrid checkboxSelection={true} rowSelection="multiple" />
```

### ✅ 8. 행 이벤트 핸들러
- **onRowClicked**: 행 클릭 시
- **onRowDoubleClicked**: 행 더블클릭 시
- **onSelectionChanged**: 선택 변경 시
- **onRowDragEnd**: 드래그 종료 시

```tsx
<AFormGrid
  onRowClicked={(data) => console.log(data)}
  onRowDoubleClicked={(data) => openEditModal(data)}
/>
```

### ✅ 9. Quick Filter (빠른 검색)
- **showQuickFilter** prop: 검색 입력창 표시
- **setQuickFilter()**: 프로그래매틱 검색
- 모든 컬럼에서 실시간 검색

```tsx
<AFormGrid showQuickFilter={true} />
gridRef.current?.setQuickFilter('검색어');
```

### ✅ 10. Material-UI Pagination
- 기존 HTML button → Material-UI Pagination 컴포넌트
- 더 나은 UX와 일관된 디자인
- 페이지 크기 선택도 Material-UI Select로 개선

### ✅ 11. 컬럼 표시/숨김 토글
- **showColumnToggle** prop: 컬럼 설정 UI 표시
- 체크박스로 컬럼 표시/숨김 제어
- **setColumnVisible()**: 프로그래매틱 제어

```tsx
<AFormGrid showColumnToggle={true} />
gridRef.current?.setColumnVisible('email', false);
```

### ✅ 12. 자동 높이 조절
- **autoHeight** prop: 데이터에 맞춰 그리드 높이 자동 조절
- 스크롤바 없이 모든 행 표시

```tsx
<AFormGrid autoHeight={true} />
```

### ✅ 13. 행 드래그 & 드롭
- **enableRowDrag** prop: 행 드래그 활성화
- **onRowDragEnd**: 드래그 완료 이벤트
- 순서 재정렬 구현 가능

```tsx
<AFormGrid 
  enableRowDrag={true} 
  onRowDragEnd={(event) => updateOrder(event)} 
/>
```

### ✅ 14. 그룹화 기능
- **enableGrouping** prop: 그룹화 기능 활성화
- 모든 컬럼에 enableRowGroup 자동 설정

```tsx
<AFormGrid enableGrouping={true} />
```

## 🔄 개선 사항

### TypeScript 타입 개선
- 모든 handle 메서드를 `AFormGridHandle` 인터페이스에 정의
- Props 타입 명확화
- AG Grid 최신 API 반영

### 코드 품질 개선
- 로딩 상태 최적화 (서버/로컬 모드 분리)
- 페이지 상태 관리 개선
- useCallback으로 이벤트 핸들러 최적화
- useMemo로 columnDefs 메모이제이션

### API 현대화
- ColumnApi 제거 (AG Grid v30+ 대응)
- setQuickFilter → setGridOption 사용
- setRowData → setGridOption 사용
- setColumnVisible → setColumnsVisible 사용

## 📊 비교표

| 기능 | 이전 | 현재 |
|------|------|------|
| 선택된 행 가져오기 | ❌ | ✅ getSelectedRows() |
| GridApi 접근 | ❌ | ✅ getGridApi() |
| Excel Export | ❌ | ✅ exportToExcel() |
| 로컬 데이터 | ❌ | ✅ rowData prop |
| 자동 조회 제어 | ❌ | ✅ autoFetch prop |
| 에러 UI | ❌ | ✅ Alert + 재시도 버튼 |
| 체크박스 선택 | ❌ | ✅ checkboxSelection prop |
| 행 이벤트 | ❌ | ✅ 4가지 이벤트 핸들러 |
| Quick Filter | ❌ | ✅ showQuickFilter prop |
| Pagination 스타일 | HTML | Material-UI |
| 컬럼 토글 | ❌ | ✅ showColumnToggle prop |
| 자동 높이 | ❌ | ✅ autoHeight prop |
| 드래그 & 드롭 | ❌ | ✅ enableRowDrag prop |
| 그룹화 | ❌ | ✅ enableGrouping prop |

## 🚀 마이그레이션 가이드

### 기존 코드는 그대로 작동합니다!

모든 기존 props는 하위 호환성을 유지합니다.

```tsx
// 이전 코드 - 그대로 작동 ✅
<AFormGrid
  url="/api/users"
  columnDefs={columnDefs}
  height={500}
/>
```

### 새로운 기능 추가 예시

```tsx
// 새 기능 추가
<AFormGrid
  ref={gridRef}
  url="/api/users"
  columnDefs={columnDefs}
  height={500}
  
  // 새로운 기능들
  checkboxSelection={true}
  showQuickFilter={true}
  showColumnToggle={true}
  onRowDoubleClicked={(data) => handleEdit(data)}
/>

// Handle API 사용
const selected = gridRef.current?.getSelectedRows();
gridRef.current?.exportToExcel('users.xlsx');
```

## 📝 브레이킹 체인지

없음! 모든 기존 코드는 그대로 작동합니다.

## 🐛 버그 수정

1. **로딩 상태 중복**: isLoading && shouldFetch 조건 개선
2. **빈 데이터 처리**: 오버레이 표시 로직 개선
3. **페이지 상태**: refetch 시 페이지 1로 초기화 (keepPageOnRefetch로 제어 가능)
4. **AG Grid API**: 최신 버전(v30+) API로 업데이트

## 📚 추가 문서

- [사용 가이드](./AGrid.usage.md) - 상세한 사용 예시와 API 문서

## 💡 앞으로의 계획

- [ ] 마스터/디테일 뷰
- [ ] 컨텍스트 메뉴
- [ ] 셀 에디터 커스터마이징
- [ ] 상태 저장/복원 (컬럼 순서, 필터 등)
- [ ] 무한 스크롤 모드

