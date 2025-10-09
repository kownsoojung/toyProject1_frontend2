import { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UseAutoQuery } from "@/hooks/useAutoQuery";

interface AFormGridProps<T, P = any> {
  url: string;
  params?: P;
  columnDefs: ColDef[];
  height?: number | string;
  gridOptions?: Partial<GridOptions>;
}

export const AFormGrid = <T, P = any>({
  url,
  params,
  columnDefs,
  height = "100%",
  gridOptions,
}: AFormGridProps<T, P>) => {
  const gridRef = useRef<{ api: any }>({ api: null });

  const { data, isLoading, error } = UseAutoQuery<T[]>({
    queryKey: ["gridData", url, params],
    url,
    params,
  });

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    if (isLoading) api.showLoadingOverlay();
    else if (error || data?.length === 0) api.showNoRowsOverlay();
    else api.setRowData(data);
  }, [data, isLoading, error]);

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height }}>
      <AgGridReact
        ref={gridRef as any}
        columnDefs={columnDefs}
        overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading...</span>'
        overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">데이터가 없습니다.</span>'
        {...gridOptions}
      />
    </div>
  );
};
