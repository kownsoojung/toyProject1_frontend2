import { RefObject, useCallback } from 'react';
import { AFormGridHandle } from '@/components/Grid';

export const useGridApi = (gridRef: RefObject<AFormGridHandle | null>) => {
  return gridRef.current?.getGridApi();
};
/**
 * AGrid의 액션 함수들을 간편하게 사용할 수 있게 해주는 Hook
 * gridRef.current?.method() 대신 method() 직접 호출 가능
 */
export const useGridActions = (gridRef: RefObject<AFormGridHandle | null>) => {
  const getSelectedRows = useCallback(() => {
    return gridRef.current?.getSelectedRows() || [];
  }, [gridRef]);

  const clearSelection = useCallback(() => {
    gridRef.current?.clearSelection();
  }, [gridRef]);

  const selectAll = useCallback(() => {
    gridRef.current?.selectAll();
  }, [gridRef]);

  const refresh = useCallback((params?: Record<string, any>) => {
    gridRef.current?.refetch(params);
  }, [gridRef]);

  const exportToExcel = useCallback(async (fileName?: string, exportUrl?: string) => {
    await gridRef.current?.exportToExcel(fileName, exportUrl);
  }, [gridRef]);

  const exportToCsv = useCallback((fileName?: string) => {
    gridRef.current?.exportToCsv(fileName);
  }, [gridRef]);

  const setQuickFilter = useCallback((text: string) => {
    gridRef.current?.setQuickFilter(text);
  }, [gridRef]);

  const setColumnVisible = useCallback((field: string, visible: boolean) => {
    gridRef.current?.setColumnVisible(field, visible);
  }, [gridRef]);

  const getGridApi = useCallback(() => {
    return gridRef.current?.getGridApi();
  }, [gridRef]);

  const getRawData = useCallback(() => {
    return gridRef.current?.getRawData() || {};
  }, [gridRef]);

  const addRow = useCallback((newRow = {}, number?:number) => {
    gridRef.current?.addRow(newRow, number);
  }, [gridRef]);

  const updateRow = useCallback((rowId: any, newData: any) => {
    gridRef.current?.updateRow(rowId, newData);
  }, [gridRef]);

  const deleteRows = useCallback((rowIds: any[]) => {
    gridRef.current?.deleteRows(rowIds);
  }, [gridRef]);

  const getAllRows = useCallback(() => {
    return gridRef.current?.getAllRows() || [];
  }, [gridRef]);

  return {
    getSelectedRows,
    clearSelection,
    selectAll,
    refresh,
    exportToExcel,
    exportToCsv,
    setQuickFilter,
    setColumnVisible,
    getGridApi,
    getRawData,
    addRow,
    updateRow,
    deleteRows,
    getAllRows,
  };
};

