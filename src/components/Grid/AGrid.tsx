// src/components/AFormGrid.tsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ColDef, GridApi, GridOptions, RowSelectionOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useApiQuery, useAutoQuery } from "@/hooks/useAutoQuery";
import { exportToExcel as exportExcel } from "@/utils/excelExport";
import { useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "@/api/baseApi";
import { 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl,
  Pagination,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useDialog } from "@/hooks/useDialog";

interface AFormGridProps {
  url: string;
  columnDefs?: ColDef[]; // children으로 컬럼을 정의할 수 있으므로 optional
  children?: React.ReactNode; // AFormGridColumn 컴포넌트들
  height?: number | string;
  minHeight?: number | string;
  pageSize?: number;
  gridOptions?: Partial<GridOptions>;
  rowName?: string;
  totalName?: string;
  renderTotal?: (total: number) => React.ReactNode;
  rowType?: {type : "single" | "singleCheck" | "singleAutoCheck" | "multi" | "multiAutoCheck" | "multiCheck",
             header? :boolean
            };

  rowSelection?: Partial<RowSelectionOptions>;
  isPage?: boolean;
  props?: Partial<AgGridReactProps<any>>;
  params?: Record<string, any>; // API 호출 시 전달할 파라미터
  
  autoFetch?: boolean; // 초기 자동 조회 여부
  showQuickFilter?: boolean; // 빠른 검색 표시
  showColumnToggle?: boolean; // 컬럼 표시/숨김 토글
  autoHeight?: boolean; // 자동 높이 조절
  enableRowDrag?: boolean; // 행 드래그 앤 드롭
  enableGrouping?: boolean; // 그룹화 기능
  
  // 툴바 커스터마이징
  renderToolbar?: (helpers: {
    totalCount: number;
    quickFilterComponent: React.ReactNode;
    columnToggleButton: React.ReactNode;
    defaultTotalDisplay: React.ReactNode;
    // 액션 함수들
    exportToExcel: (fileName?: string, exportUrl?: string) => Promise<void>;
    exportToCsv: (fileName?: string) => void;
    getSelectedRows: () => any[];
    clearSelection: () => void;
    selectAll: () => void;
    refresh: () => void;
  }) => React.ReactNode;
  showToolbar?: boolean; // 툴바 표시 여부 (기본: true)
  
  // 이벤트 핸들러
  onRowClicked?: (data: any) => void;
  onRowDoubleClicked?: (data: any) => void;
  onSelectionChanged?: (selectedRows: any[]) => void;
  onRowDragEnd?: (data: any) => void;
  
  // 페이지 상태 유지 옵션
  keepPageOnRefetch?: boolean; // refetch 시 현재 페이지 유지
}

export interface AFormGridHandle {
  refetch: (newParams?: Record<string, any>) => void;
  getRawData: () => Record<string, any>;
  getSelectedRows: () => any[];
  getGridApi: () => GridApi | undefined;
  exportToExcel: (fileName?: string, exportUrl?: string) => Promise<void>;
  exportToCsv: (fileName?: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  setQuickFilter: (text: string) => void;
  setColumnVisible: (field: string, visible: boolean) => void;
  addRow: (newRow?: any) => void;
  updateRow: (rowId: any, newData: any) => void;
  deleteRows: (rowIds: any[]) => void;
  getAllRows: () => any[];
}

export const AFormGrid = forwardRef<AFormGridHandle, AFormGridProps>(
  (
    {
      url,
      columnDefs: propColumnDefs,
      children,
      height = "100%",
      minHeight = "300px",
      pageSize = 10,
      gridOptions,
      rowName = "dataList",
      totalName = "totalCnt",
      rowType = {type : "single", header : true},
      rowSelection,
      isPage = true,
      renderTotal,
      props,
      params: initialParams = {},
      autoFetch = false,
      showQuickFilter = false,
      showColumnToggle = false,
      autoHeight = false,
      enableRowDrag = false,
      enableGrouping = false,
      
      // 툴바 커스터마이징
      renderToolbar,
      showToolbar = true,
      
      // 이벤트 핸들러
      onRowClicked,
      onRowDoubleClicked,
      onSelectionChanged,
      onRowDragEnd,
      
      keepPageOnRefetch = false,
    },
    ref
  ) => {
    // children으로부터 columnDefs 추출
    const columnDefs = useMemo(() => {
      if (propColumnDefs) {
        return propColumnDefs;
      }
      
      // children에서 AFormGridColumn 컴포넌트의 props 추출
      const columns: ColDef[] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const props = child.props as any;
          // name prop을 field로 변환
          const colDef: ColDef = {
            ...props,
            field: props.field || props.name, // name을 field로 변환
          };
          delete (colDef as any).name; // name 속성 제거
          columns.push(colDef);
        }
      });
      
      return columns;
    }, [propColumnDefs, children]);

    const [params, setParams] = useState<Record<string, any>>(initialParams);
    const [page, setPage] = useState<number>(1);
    const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [quickFilterText, setQuickFilterText] = useState<string>("");
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});

    const gridRef = useRef<AgGridReact>(null);
    const dialog = useDialog();
    const queryClient = useQueryClient();
    
    // initialParams가 변경되면 params도 업데이트
    useEffect(() => {
      setParams(initialParams);
    }, [initialParams]);

    const [shouldFetch, setShouldFetch] = useState(autoFetch);
    const rowTypedata: RowSelectionOptions = useMemo(() => {
      const type = rowType.type;
      const mode: RowSelectionOptions["mode"] = type.match(/multi/) ? "multiRow" : "singleRow";
      const enableClickSelection = type.match(/Auto/) || !type.match(/Check/) || type === "single" ? true :false;
      const hideDisabledCheckboxes = true;
      const enableSelectionWithoutKeys = type === "single" ? false : true;
      const headerCheckbox = rowType.header;
      const checkboxes = type.match(/Check/) ? true : false;
      return {
        mode,
        enableClickSelection,
        hideDisabledCheckboxes,
        enableSelectionWithoutKeys,
        headerCheckbox,
        checkboxes,
        ...(rowSelection || {}),
      };
    }, [rowType, rowSelection]);
    // 서버 자동 조회
    const { data, isLoading, error, refetch } = useApiQuery<Record<string, any>>({
      queryKey: ["gridData", url, params, page, pageSizeState],
      url: url,
      params: { ...params, page, pageSize: pageSizeState },
      options: { enabled: shouldFetch },
    });

    // 컬럼 가시성 초기화
    useEffect(() => {
      const initialVisibility: Record<string, boolean> = {};
      columnDefs.forEach((col) => {
        if (col.field) {
          initialVisibility[col.field] = col.hide !== true;
        }
      });
      setVisibleColumns(initialVisibility);
    }, [columnDefs]);

    useEffect(() => {
      if (shouldFetch) {
        refetch();
      }
    }, [page, pageSizeState, shouldFetch, refetch]);

    // 에러 감지
    useEffect(() => {
      if (error) {
        dialog.error('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    }, [error, dialog]);

    // imperative handle - 외부에서 사용할 메서드들
    useImperativeHandle(ref, () => ({
      refetch: (newParams?: Record<string, any>) => {
        setParams(newParams || {});
        if (!keepPageOnRefetch) {
          setPage(1);
        }
        setShouldFetch(true);
        refetch();
      },
      getRawData: () => data || {},
      getSelectedRows: () => {
        return gridRef.current?.api?.getSelectedRows() || [];
      },
      getGridApi: () => gridRef.current?.api,
      exportToExcel: async (fileName = "export.xlsx", exportUrl = "") => {
        let dataToExport: any[] = [];

        if (exportUrl) {
          // AGrid에서 전체 데이터 조회 (QueryClient 사용)
          try {
            const response = await apiInstance.request({
              url: exportUrl,
              method: 'GET',
              params: params,
            });
            
            dataToExport = response.data[rowName] || response.data;
          } catch (error) {
            console.error('데이터 조회 실패:', error);
            return;
          }
        } else {
          // 현재 화면 데이터

          if (gridRef.current?.api?.getDisplayedRowCount() == 0) {
            dialog.warning('데이터가 없습니다.');
            return;
          }
          
          gridRef.current?.api?.forEachNodeAfterFilterAndSort(node => {
            dataToExport.push(node.data);
          });
        }
        
        // Excel 생성은 excelExport 유틸 사용
        await exportExcel({
          data: dataToExport,
          columnDefs: enhancedColumnDefs,
          fileName,
        });
      },
      exportToCsv: (fileName = "export.csv") => {
        gridRef.current?.api?.exportDataAsCsv({
          fileName,
        });
      },
      clearSelection: () => {
        gridRef.current?.api?.deselectAll();
      },
      selectAll: () => {
        gridRef.current?.api?.selectAll();
      },
      setQuickFilter: (text: string) => {
        setQuickFilterText(text);
        gridRef.current?.api?.setGridOption('quickFilterText', text);
      },
      setColumnVisible: (field: string, visible: boolean) => {
        gridRef.current?.api?.setColumnsVisible([field], visible);
      },
      addRow: (newRow = {}) => {
        gridRef.current?.api?.applyTransaction({ add: [newRow], addIndex: 0 });
      },
      updateRow: (rowId: any, newData: any) => {
        const api = gridRef.current?.api;
        api?.forEachNode(node => {
          if (node.data.id === rowId) {
            node.setData({ ...node.data, ...newData });
          }
        });
      },
      deleteRows: (rowIds: any[]) => {
        const api = gridRef.current?.api;
        const rowsToDelete: any[] = [];
        api?.forEachNode(node => {
          if (rowIds.includes(node.data.id)) {
            rowsToDelete.push(node.data);
          }
        });
        api?.applyTransaction({ remove: rowsToDelete });
      },
      getAllRows: () => {
        const rows: any[] = [];
        gridRef.current?.api?.forEachNode(node => rows.push(node.data));
        return rows;
      },
    }));


    // 서버 데이터 처리
    useEffect(() => {
      const api = gridRef.current?.api;
      if (!api) return;

      if (error) {
        api.showNoRowsOverlay?.();
      } else if (isLoading) {
        // 로딩 중일 때 기존 데이터 비우기
        api.setGridOption('rowData', []);
      }
      else if (!data?.[rowName] || data[rowName].length === 0) {
        api.showNoRowsOverlay?.();
        api.setGridOption('rowData', []);
      } else {
        api.setGridOption('rowData', data[rowName] || []);
        if (totalName) setTotalCount(data[totalName] || 0);
        api.hideOverlay();
      }
    }, [data, isLoading, error, rowName, totalName]);

    // 컬럼 가시성 변경 처리
    const handleColumnToggle = useCallback((field: string) => {
      const api = gridRef.current?.api;
      if (!api) return;

      const newVisibility = !visibleColumns[field];
      api.setColumnsVisible([field], newVisibility);
      setVisibleColumns((prev) => ({
        ...prev,
        [field]: newVisibility,
      }));
    }, [visibleColumns]);

    // 이벤트 핸들러들
    const handleRowClicked = useCallback((event: any) => {
        
      if (onRowClicked) {
        onRowClicked(event.data);
      }
    }, [onRowClicked]);

    const handleRowDoubleClicked = useCallback((event: any) => {
      if (onRowDoubleClicked) {
        onRowDoubleClicked(event.data);
      }
    }, [onRowDoubleClicked]);

    const handleSelectionChanged = useCallback(() => {
      if (onSelectionChanged) {
        const selectedRows = gridRef.current?.api?.getSelectedRows() || [];
        onSelectionChanged(selectedRows);
      }
    }, [onSelectionChanged]);

    const handleRowDragEnd = useCallback((event: any) => {
      if (onRowDragEnd) {
        onRowDragEnd(event);
      }
    }, [onRowDragEnd]);

    // 페이지 계산
    const totalPages = Math.ceil(totalCount / pageSizeState);

    // 향상된 columnDefs (체크박스, 드래그, 그룹화 지원)
    const enhancedColumnDefs = React.useMemo(() => {
      return columnDefs.map((col, index) => {
        const enhanced: ColDef = { ...col };
        
        if (enableRowDrag && index === 0) {
          enhanced.rowDrag = true;
        }
        
        if (enableGrouping && col.field) {
          enhanced.enableRowGroup = true;
        }
        
        return enhanced;
      });
    }, [columnDefs, enableRowDrag, enableGrouping]);

    // 기본 총건수 표시 컴포넌트
    const defaultTotalDisplay = React.useMemo(() => (
      <Box>
        {renderTotal ? renderTotal(totalCount) : <Box>총 {totalCount}건</Box>}
      </Box>
    ), [totalCount, renderTotal]);

    // 빠른 검색 컴포넌트
    const quickFilterComponent = React.useMemo(() => {
      if (!showQuickFilter) return null;
      return (
        <TextField
          size="small"
          placeholder="검색..."
          value={quickFilterText}
          onChange={(e) => {
            setQuickFilterText(e.target.value);
            gridRef.current?.api?.setGridOption('quickFilterText', e.target.value);
          }}
          sx={{ width: 200 }}
        />
      );
    }, [showQuickFilter, quickFilterText]);

    // 컬럼 토글 버튼 컴포넌트
    const columnToggleButton = React.useMemo(() => {
      if (!showColumnToggle) return null;
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            // 컬럼 설정 토글
          }}
        >
          컬럼 설정
        </Button>
      );
    }, [showColumnToggle]);

    return (
      <Box 
        sx={{ 
          height: autoHeight ? "auto" : (typeof height === "number" ? `${height}px` : height),
          minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
          display: "flex",
          flexDirection: "column"
        }}
      >
        
        {/* 상단 툴바 */}
        {showToolbar && (
          renderToolbar ? (
            <Box sx={{ mb: 1, flexShrink: 0 }}>
              {renderToolbar({
                totalCount,
                quickFilterComponent,
                columnToggleButton,
                defaultTotalDisplay,
                // 액션 함수들
                exportToExcel: async (fileName = "export.xlsx", exportUrl = "") => {
                  let dataToExport: any[] = [];

                  if (exportUrl) {
                    // AGrid에서 전체 데이터 조회 (QueryClient 사용)
                    try {
                      const result = await queryClient.fetchQuery({
                        queryKey: ['excelExport', exportUrl],
                        queryFn: async () => {
                          const response = await fetch(exportUrl, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                          });
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                          
                          return response.json();
                        },
                      });
                      dataToExport = result[rowName] || result;
                    } catch (error) {
                      console.error('데이터 조회 실패:', error);
                      return;
                    }
                  } else {
                    // 현재 화면 데이터
                    gridRef.current?.api?.forEachNodeAfterFilterAndSort(node => {
                      dataToExport.push(node.data);
                    });
                  }
                  
                  // Excel 생성은 excelExport 유틸 사용
                  await exportExcel({
                    data: dataToExport,
                    columnDefs: enhancedColumnDefs,
                    fileName,
                  });
                },
                exportToCsv: (fileName = "export.csv") => {
                  gridRef.current?.api?.exportDataAsCsv({
                    fileName,
                  });
                },
                getSelectedRows: () => gridRef.current?.api?.getSelectedRows() || [],
                clearSelection: () => gridRef.current?.api?.deselectAll(),
                selectAll: () => gridRef.current?.api?.selectAll(),
                refresh: () => {
                  setShouldFetch(true);
                  refetch();
                },
              })}
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexShrink: 0 }}>
              {defaultTotalDisplay}
              {/* 빠른 검색 및 액션 버튼들 */}
              <Stack direction="row" spacing={1} alignItems="center">
                {quickFilterComponent}
                {columnToggleButton}
              </Stack>
            </Box>
          )
        )}

        {/* 컬럼 표시/숨김 토글 (showColumnToggle이 true일 때) */}
        {showColumnToggle && (
          <Box sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1, bgcolor: "#f9f9f9", flexShrink: 0 }}>
            <FormGroup row>
              {columnDefs.filter((col) => col.field).map((col) => (
                <FormControlLabel
                  key={col.field}
                  control={
                    <Checkbox
                      checked={visibleColumns[col.field!] ?? true}
                      onChange={() => handleColumnToggle(col.field!)}
                      size="small"
                    />
                  }
                  label={col.headerName || col.field}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {/* AG Grid */}
        <Box sx={{ flexGrow: 1, minHeight: 0, width: "100%" }}>
          <div 
            className="ag-theme-alpine" 
            style={{ 
              width: "100%", 
              height: "100%"
            }}
          >
          <AgGridReact
            ref={gridRef as any}
            columnDefs={enhancedColumnDefs}
            defaultColDef={{
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
            }}
            
            pagination={false}
            loadingOverlayComponentParams={{ loadingMessage: '로딩 중...' }}
            loading={isLoading && shouldFetch}
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">데이터가 없습니다.</span>'
            rowSelection={rowTypedata}
            domLayout={autoHeight ? "autoHeight" : "normal"}
            suppressHorizontalScroll={false}
            rowDragManaged={enableRowDrag}
            animateRows={true}
            suppressRowHoverHighlight={true}
            // 이벤트 핸들러
            onRowClicked={handleRowClicked}
            onRowDoubleClicked={handleRowDoubleClicked}
            onSelectionChanged={handleSelectionChanged}
            onRowDragEnd={handleRowDragEnd}
            
            {...props}
            {...gridOptions}
          />
        </div>
        </Box>

        {/* 페이지네이션 */}
        {isPage  && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, flexShrink: 0 }}>
            {/* 페이지 크기 선택 */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={pageSizeState}
                onChange={(e) => {
                  setPageSizeState(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 30, 50, 100].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}개씩 보기
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Material-UI Pagination */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
              siblingCount={2}
              boundaryCount={1}
            />
            
            <Box sx={{ width: 120 }} /> {/* 균형을 위한 빈 공간 */}
          </Box>
        )}

      </Box>
    );
  }
);

AFormGrid.displayName = "AFormGrid";

