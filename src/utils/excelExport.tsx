import ExcelJS from 'exceljs';
import { ColDef } from 'ag-grid-community';

interface ExportOptions {
  data: any[];
  columnDefs: ColDef[];
  fileName: string;
  sheetName?: string;
}

/**
 * 데이터를 Excel 파일로 내보내기
 */
export const exportToExcel = async ({
  data,
  columnDefs,
  fileName,
  sheetName = 'Sheet1'
}: ExportOptions): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // 컬럼 설정 (숨겨진 컬럼, suppressColumnsToolPanel, _로 시작하는 컬럼 제외)
    const visibleColumns = columnDefs.filter(col => {
      if (!col.field || col.hide) return false;
      if ((col as any).suppressColumnsToolPanel) return false;
      if (col.field.startsWith('_')) return false;
      return true;
    });
    
    worksheet.columns = visibleColumns.map(col => ({
      header: col.headerName || col.field || '',
      key: col.field || '',
      width: col.width ? col.width / 10 : 15,
    }));

    // 데이터 변환 (valueFormatter 적용)
    const formattedData = data.map(row => {
      const formattedRow: any = {};
      visibleColumns.forEach(col => {
        const field = col.field || '';
        const value = row[field];
        
        // valueFormatter가 있으면 적용
        if (col.valueFormatter && typeof col.valueFormatter === 'function') {
          formattedRow[field] = col.valueFormatter({ 
            value, 
            data: row, 
            column: col,
            node: null,
            colDef: col,
            api: null,
            columnApi: null,
            context: null
          } as any);
        } else {
          formattedRow[field] = value;
        }
      });
      return formattedRow;
    });

    // 데이터 추가
    worksheet.addRows(formattedData);

    // 헤더 스타일
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // 전체 범위에 테두리 적용 (빈 셀 포함)
    const rowCount = worksheet.rowCount;
    const colCount = visibleColumns.length;
    
    for (let rowIdx = 1; rowIdx <= rowCount; rowIdx++) {
      const row = worksheet.getRow(rowIdx);
      for (let colIdx = 1; colIdx <= colCount; colIdx++) {
        const cell = row.getCell(colIdx);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }

    // 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
};

/**
 * 서버에서 전체 데이터 조회 후 Excel 내보내기
 */
export const exportAllToExcel = async ({
  url,
  columnDefs,
  fileName,
  rowName = 'dataList',
  sheetName = 'Sheet1'
}: {
  url: string;
  columnDefs: ColDef[];
  fileName: string;
  rowName?: string;
  sheetName?: string;
}): Promise<void> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const data = result[rowName] || result;

    await exportToExcel({ data, columnDefs, fileName, sheetName });
  } catch (error) {
    console.error('Export all data error:', error);
    throw error;
  }
};

