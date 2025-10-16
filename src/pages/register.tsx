// src/components/RegisterTableForm.tsx
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Box, TableRow, TableCell, Stack } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateDateRanges, validateTimeRanges } from "@/validation/Validation";
import { AFormTextField } from "@/components/AFormItem/AFormTextField";
import { AFormDate } from "@/components/AFormItem/AFormDate";
import { AFormTime } from "@/components/AFormItem/AFormTime";
import { AFormCheckbox } from "@/components/AFormItem/AFormCheckbox";
import { AFormRadio } from "@/components/AFormItem/AFormRadio";
import { AFormGrid, AFormGridHandle } from "@/components/AFormItem/Grid/AGrid";
import AForm from "@/components/AFormItem/AForm";
import { FormButtons, FormHeader } from "@/styles/theme";
import { useGridActions } from "@/hooks/useGridActions";
import { AddButton, DeleteButton, RefreshButton, ExcelButton } from "@/components/AFormItem/common/AButton";
import { AutoBox, MainFormBox, RatioBox } from "@/components/AFormItem/common/ABox";
import { useLoading } from "@/hooks/useLoading";
import { useDialog } from "@/hooks/useDialog";

export default function RegisterTableForm() {
  const gridRef = useRef<AFormGridHandle>(null);
  const { withLoading } = useLoading();
  const dialog = useDialog();

  // ✨ 액션 함수들을 간편하게 사용
  const { getSelectedRows, refresh, exportToExcel, addRow, deleteRows } = useGridActions(gridRef);

  const registerSchema = z.object({
    username: z.string().nonempty().min(3),
    password: z.string().nonempty(),
    email: z.string().email(),
    textbox: z.string(),
    start: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }).superRefine((data, ctx) => {
    validateDateRanges([{ fieldStart: "start", fieldEnd: "endDate", type: "m", max: 2 }])(data, ctx);
    validateTimeRanges([{ fieldStart: "startTime", fieldEnd: "endTime", type: "m", maxDiff: 120 }])(data, ctx);
  });

  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      textbox: "",
      start: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    await withLoading(async () => {
      // 임시로 3초 대기 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("제출 데이터:", data);
    }, 'save');
    
    // 저장 완료 후 토스트 알림
    dialog.success('저장 완료!');
  };

  // Grid 버튼 핸들러
  const handleAdd = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addRow({ id: Date.now(), name: "새 항목" });
    }, 'save');
    
    dialog.success('항목이 추가되었습니다!');
  };

  const handleDelete = async () => {
    const selected = getSelectedRows();
    
    if (selected.length === 0) {
      deleteRows(selected);
      dialog.warning('삭제할 항목을 선택하세요.');
      return;
    }
    // 삭제 확인
    const confirmed = await dialog.confirm(`선택한 ${selected.length}개 항목을 삭제하시겠습니까?`);
    
    if (!confirmed) { return;}
    
    await withLoading(async () => {
      const ids = selected.map(row => row.id);
      await new Promise(resolve => setTimeout(resolve, 1500));
      deleteRows(ids);
      console.log("삭제된 데이터:", selected);
    }, 'delete');
    
    dialog.success('삭제되었습니다!');
  };

  const handleRefresh = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      refresh();
    }, 'search');
    
  };

  const handleExportAll = async () => {
    await withLoading(async () => {
      await exportToExcel("전체데이터.xlsx");
    }, 'Excel 다운로드 중...');
    
    dialog.success('Excel 파일이 다운로드되었습니다!');
  };

  return (
  <MainFormBox>
      <FormHeader>
        <Box component="span" sx={{ fontWeight: 600 }}>회원가입</Box>
        <FormButtons>
          <Button variant="contained" onClick={methods.handleSubmit(onSubmit)}>제출</Button>
          <Button variant="outlined" color="error" onClick={() => methods.reset()}>초기화</Button>
        </FormButtons>
      </FormHeader>
      <AForm onSubmit={onSubmit} methods={methods} > 
        {/* 아이디 / 비밀번호 */}
        <TableRow>
          <TableCell component="th" className="required">아이디</TableCell>
          <TableCell>
              <AFormTextField name="username" msize={80} />
          </TableCell>
          <TableCell component="th" className="required">비밀번호</TableCell>
          <TableCell>
            <AFormTextField name="password" type="password" />
          </TableCell>
        </TableRow>

        {/* 이메일 */}
        <TableRow>
          <TableCell component="th" className="required">이메일</TableCell>
          <TableCell colSpan={3}>
            <AFormTextField name="email"  />
          </TableCell>
        </TableRow>

        {/* 내용 */}
        <TableRow>
          <TableCell component="th">내용</TableCell>
          <TableCell colSpan={3}>
            <AFormTextField name="textbox" multiline rows={4} />
          </TableCell>
        </TableRow>

        {/* 체크박스 / 시간 */}
        <TableRow>
          <TableCell component="th">체크박스</TableCell>
          <TableCell>
            <AFormCheckbox name="dd" checkList={{label:"test10", value:"test"}} />
          </TableCell>
          <TableCell component="th">시간</TableCell>
          <TableCell>
            <AFormTime  name="startTime" formatType="hour" endName="endTime" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell component="th">체크박스</TableCell>
          <TableCell>
            <AFormRadio name="dd" checkList={[{label:"test10", value:"test"}, {label:"test11", value:"test11"}]} />
          </TableCell>
          <TableCell component="th">시간</TableCell>
          <TableCell>
            <AFormTime  name="startTime" formatType="hour" endName="endTime" />
          </TableCell>
        </TableRow>

        {/* 날짜 범위 */}
        <TableRow>
          <TableCell component="th">조회일자</TableCell>
          <TableCell colSpan={3}>
            <AFormDate label="test" name="start" endName="endDate" formatType="datetime" mStep={5} />
          </TableCell>
        </TableRow>
      </AForm>
      <AutoBox>
      <RatioBox ratios={[1, 1]} direction="row" gap={2} sxProps={{ flex: 1, minHeight: 400 }}>
      {/* 왼쪽 그리드 영역 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AFormGrid
          ref={gridRef}
          url=""
          minHeight={400}
          columnDefs={[
            { field: "id", headerName: "ID" },
            { field: "name", headerName: "Name" },
          ]}
          isPage={true}
          showQuickFilter={false}
          rowType={{type : "single"}}
          renderToolbar={({ quickFilterComponent, defaultTotalDisplay }) => (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* 왼쪽: 총건수 */}
              {defaultTotalDisplay}

              {/* 오른쪽: 검색 + 버튼들 */}
              <Stack direction="row" spacing={1} alignItems="center">
                {quickFilterComponent}
                
                <RefreshButton size="small" onClick={handleRefresh} />
                <DeleteButton size="small" onClick={handleDelete} />
                <AddButton size="small" onClick={handleAdd} />
                <ExcelButton size="small" text="Excel (전체)" onClick={handleExportAll} />
              </Stack>
            </Box>
          )}
          onRowDoubleClicked={(data) => (
            console.log(data)
          )}
        />
      </Box>
      
      {/* 오른쪽 영역 */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 2, 
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        영역2
      </Box>
      </RatioBox>
      </AutoBox>
    </MainFormBox>
  );
}
