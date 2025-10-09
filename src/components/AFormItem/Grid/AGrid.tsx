// src/components/AFormGrid.tsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UseAutoQuery } from "@/hooks/useAutoQuery";

interface AFormGridProps {
  url: string;
  columnDefs: ColDef[];
  height?: number | string;
  pageSize?: number;
  gridOptions?: Partial<GridOptions>;
  rowName?: string;      // 기본 "rows"
  totalName?: string;    // 기본 "total"
  isPage?: boolean;
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
      rowName = "rows",
      totalName = "total",
      isPage = true,
    },
    ref
  ) => {
    const [params, setParams] = useState<Record<string, any>>({});
    const [page, setPage] = useState<number>(1);
    const [pageSizeState, setPageSizeState] = useState<number>(pageSize);
    const [totalCount, setTotalCount] = useState<number>(0);

    const gridRef = useRef<AgGridReact>(null);

    const { data, isLoading, error, refetch } = UseAutoQuery<Record<string, any>>({
      queryKey: ["gridData", url, params, page, pageSizeState],
      url,
      params: { ...params, page, pageSize: pageSizeState },
    });

    // 외부에서 refetch 호출 가능
    useImperativeHandle(ref, () => ({
      refetch: (newParams?: Record<string, any>) => {
        setParams(newParams || {});
        setPage(1);
      },
    }));

    // params, page, pageSize 변경 시 자동 refetch
    useEffect(() => {
      refetch();
    }, [params, page, pageSizeState]);

    // 데이터 AG Grid에 반영
    useEffect(() => {
      const api = gridRef.current?.api;
      if (!api) return;

      if (isLoading) api.showLoadingOverlay();
      else if (error || !(data?.[rowName]?.length > 0)) api.showNoRowsOverlay();
      else {
        (api as any).setRowData(data?.[rowName] || []);
        if (totalName) setTotalCount(data?.[totalName] || 0);
      }
    }, [data, isLoading, error]);

    const totalPages = Math.ceil(totalCount / pageSizeState);

    return (
      <div>
        {/* 총건수 */}
        {totalName && <div style={{ marginBottom: 8 }}>총 {totalCount}건</div>}

        {/* 페이지 크기 선택 */}
        {isPage && (
          <div style={{ marginBottom: 8 }}>
            페이지 크기:{" "}
            {[10, 30, 50, 100].map((size) => (
              <button
                key={size}
                style={{
                  fontWeight: size === pageSizeState ? "bold" : "normal",
                  marginRight: 4,
                }}
                onClick={() => {
                  setPageSizeState(size);
                  setPage(1);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* AG Grid */}
        <div className="ag-theme-alpine" style={{ width: "100%", height }}>
          <AgGridReact
            ref={gridRef as any}
            columnDefs={columnDefs}
            pagination={false} // 서버 페이징이므로 AG Grid 자체 pagination 비활성
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">데이터가 없습니다.</span>'
            {...gridOptions}
          />
        </div>

        {/* 페이지 버튼 */}
        {isPage && totalPages > 1 && (
          <div style={{ marginTop: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                style={{
                  fontWeight: i + 1 === page ? "bold" : "normal",
                  marginRight: 4,
                }}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
