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

    // 컬럼 설정 (숨겨진 컬럼 제외)
    const visibleColumns = columnDefs.filter(col => col.field && !col.hide);
    
    worksheet.columns = visibleColumns.map(col => ({
      header: col.headerName || col.field || '',
      key: col.field || '',
      width: col.width ? col.width / 10 : 15,
    }));

    // 데이터 추가
    worksheet.addRows(data);

    // 헤더 스타일
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // 모든 셀에 테두리 추가
    worksheet.eachRow((row) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

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

