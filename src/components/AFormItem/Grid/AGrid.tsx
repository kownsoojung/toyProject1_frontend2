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
  rowName?: string;
  totalName?: string;
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

    useImperativeHandle(ref, () => ({
      refetch: (newParams?: Record<string, any>) => {
        setParams(newParams || {});
        setPage(1);
      },
    }));

    useEffect(() => {
      refetch();
    }, [params, page, pageSizeState]);

    useEffect(() => {
      const api = gridRef.current?.api;
      if (!api) return;

      if (isLoading) api.showLoadingOverlay?.();
      else if (error || !(data?.[rowName]?.length > 0)) api.showNoRowsOverlay?.();
      else {
        (api as any).setRowData(data?.[rowName] || []);
        if (totalName) setTotalCount(data?.[totalName] || 0);
      }
    }, [data, isLoading, error]);

    const totalPages = Math.ceil(totalCount / pageSizeState);

    // 페이지 버튼 최대 10개
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
        {totalName && <div>총 {totalCount}건</div>}

        {/* AG Grid */}
        <div className="ag-theme-alpine" style={{ width: "100%", height }}>
          <AgGridReact
            ref={gridRef as any}
            columnDefs={columnDefs}
            pagination={false}
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">데이터가 없습니다.</span>'
            {...gridOptions}
          />
        </div>

        {/* 하단 페이지 및 페이지 크기 선택 */}
        {isPage &&  (
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 0 }}>
            {/* 페이지 크기 선택 (왼쪽) */}
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

            {/* 페이지 버튼 (오른쪽) */}
            <div>
              {pagesToShow.map((p) => (
                <button
                  key={p}
                  style={{
                    fontWeight: p === page ? "bold" : "normal",
                    marginRight: 4,
                  }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
