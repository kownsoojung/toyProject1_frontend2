/**
 * 전역 Dialog/Toast 사용 예제
 * 
 * 이 파일은 예제용이므로 실제 프로젝트에서는 삭제하거나
 * 다른 위치로 옮기셔도 됩니다.
 */

import React from 'react';
import { Button, Stack, Typography, Paper, Box } from '@mui/material';
import { useDialog } from '@/hooks/useDialog';
import { useAppDispatch } from '@/store/hooks';
import { showAlert, showConfirm } from '@/store/slices/dialogSlice';
import { showToast } from '@/store/slices/toastSlice';

export const DialogExample: React.FC = () => {
  const dialog = useDialog();
  const dispatch = useAppDispatch();

  // 방법 1: useDialog hook 사용 (추천)
  const handleToastExample = () => {
    dialog.success('작업이 완료되었습니다!');
  };

  const handleAlertExample = () => {
    dialog.alert('이것은 알림 메시지입니다.', 'info', '알림');
  };

  const handleConfirmExample = async () => {
    const result = await dialog.confirm('정말 삭제하시겠습니까?', '삭제 확인');
    if (result) {
      dialog.success('삭제되었습니다.');
    } else {
      dialog.info('취소되었습니다.');
    }
  };

  // 방법 2: dispatch 직접 사용
  const handleDirectDispatch = () => {
    dispatch(showToast({ 
      message: 'dispatch로 직접 호출', 
      severity: 'warning',
      duration: 2000
    }));
  };

  const handleErrorExample = () => {
    dispatch(showAlert({
      message: '오류가 발생했습니다. 다시 시도해주세요.',
      type: 'error',
      title: '오류'
    }));
  };

  // API 호출 예제
  const handleApiExample = async () => {
    try {
      // const response = await apiCall();
      dialog.success('API 호출 성공!');
    } catch (error: any) {
      dialog.alert(error.message, 'error', 'API 오류');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        전역 Dialog/Toast 예제
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎨 Toast (간단한 알림)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="success" onClick={() => dialog.success('성공!')}>
            Success Toast
          </Button>
          <Button variant="contained" color="error" onClick={() => dialog.error('에러!')}>
            Error Toast
          </Button>
          <Button variant="contained" color="warning" onClick={() => dialog.warning('경고!')}>
            Warning Toast
          </Button>
          <Button variant="contained" color="info" onClick={() => dialog.info('정보!')}>
            Info Toast
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          💬 Alert (확인만 필요한 다이얼로그)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleAlertExample}>
            Info Alert
          </Button>
          <Button variant="outlined" color="error" onClick={handleErrorExample}>
            Error Alert
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          ❓ Confirm (확인/취소가 필요한 다이얼로그)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="error" onClick={handleConfirmExample}>
            삭제 Confirm
          </Button>
          <Button variant="outlined" onClick={async () => {
            const result = await dialog.confirm('저장하시겠습니까?');
            dialog.toast(result ? '저장됨' : '취소됨', result ? 'success' : 'info');
          }}>
            저장 Confirm
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔧 직접 Dispatch 사용
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="text" onClick={handleDirectDispatch}>
            Direct Dispatch
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.100' }}>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
{`// 사용법 예제

import { useDialog } from '@/hooks/useDialog';

function MyComponent() {
  const dialog = useDialog();

  // Toast
  dialog.success('성공!');
  dialog.error('에러!');
  dialog.warning('경고!');
  dialog.info('정보!');

  // Alert
  dialog.alert('메시지', 'error', '제목');

  // Confirm (async/await)
  const result = await dialog.confirm('삭제할까요?');
  if (result) {
    // 확인 클릭
  }
}`}
        </Typography>
      </Paper>
    </Box>
  );
};

