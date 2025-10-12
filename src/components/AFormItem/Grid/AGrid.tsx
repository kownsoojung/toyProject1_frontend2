// src/components/AFormGrid.tsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UseAutoQuery } from "@/hooks/useAutoQuery";

interface AFormGridProps {
  url: string;
  columnDefs: ColDef[];
  height?: number | string;
  pageSize?: number;
  gridOptions?: Partial<GridOptions>;
  rowName?: string;
  totalName?: string;
  renderTotal?: (total: number) => React.ReactNode;
  rowSelection?: "single" | "multiple";
  isPage?: boolean;
  props?:Partial<AgGridReactProps<any>>; 
}

export interface AFormGridHandle {
  refetch: (newParams?: Record<string, any>) => void;
}

export const AFormGrid = forwardRef<AFormGridHandle, AFormGridProps>(
  (
    {
      url,
      columnDefs,
      height = "400px",
      pageSize = 10,
      gridOptions,
      rowName = "dataList",
      totalName = "totalCnt",
      rowSelection = "single",
      isPage = true,
      renderTotal,
      props
    },
    ref
  ) => {
    const [params, setParams] = useState<Record<string, any>>({});
    const [page, setPage] = useState<number>(1);
    const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
    const [totalCount, setTotalCount] = useState<number>(0);

    const gridRef = useRef<AgGridReact>(null);

    const [shouldFetch, setShouldFetch] = useState(false);
    // 서버 자동 조회
    const { data, isLoading, error, refetch } = UseAutoQuery<Record<string, any>>({
      queryKey: ["gridData", url, params, page, pageSizeState],
      url,
      params: { ...params, page, pageSize: pageSizeState },
      options: { enabled: shouldFetch },
    });

    useImperativeHandle(ref, () => ({
      refetch: (newParams?: Record<string, any>) => {
        setParams(newParams || {});
        setPage(1);
        setShouldFetch(true);
        refetch();
      },
      getRawData: () => data || {}
    }));


    useEffect(() => {
      const api = gridRef.current?.api;
      if (!api) return;

      else if (error || !(data?.[rowName]?.length > 0)) api.showNoRowsOverlay?.();
      else {
        (api as any).setRowData(data?.[rowName] || []);
        if (totalName) setTotalCount(data?.[totalName] || 0);
      }
    }, [data, isLoading, error]);

    // 페이지 계산
    const totalPages = Math.ceil(totalCount / pageSizeState);
    const maxButtons = 10;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div>
        {/* 총건수 */}
        {renderTotal ? renderTotal(totalCount) : <div style={{ marginBottom: 8 }}>총 {totalCount}건</div>}

        {/* AG Grid */}
        <div className="ag-theme-alpine" style={{ width: "100%", height: typeof height === "number" ? `${height}px` : height }}>
          <AgGridReact
            ref={gridRef as any}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={false}
            loadingOverlayComponentParams={{ loadingMessage: 'Loading...' }}
            loading={isLoading && shouldFetch} 
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">데이터가 없습니다.</span>'
            rowSelection= {rowSelection}
            {...props}
            {...gridOptions}
          />
        </div>

        {/* 페이지네이션 */}
        {isPage && totalPages > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
            {/* 페이지 크기 선택 */}
            <div>
              <select
                value={pageSizeState}
                onChange={(e) => {
                  setPageSizeState(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 30, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n} / 페이지
                  </option>
                ))}
              </select>
            </div>

            {/* 페이지 버튼 */}
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                이전
              </button>
              {pagesToShow.map((p) => (
                <button
                  key={p}
                  style={{ fontWeight: p === page ? "bold" : "normal" }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
