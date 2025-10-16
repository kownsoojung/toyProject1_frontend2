/**
 * 전역 로딩 스피너 사용 예제
 */

import React from 'react';
import { Button, Stack, Paper, Box, Typography } from '@mui/material';
import { useLoading } from '@/hooks/useLoading';
import { useAutoMutation } from '@/hooks/useAutoMutation';

export const LoadingExample: React.FC = () => {
  const { startLoading, stopLoading, withLoading } = useLoading();

  // 예제 1: 수동으로 로딩 제어
  const handleManualLoading = async () => {
    startLoading('데이터 저장 중...');
    
    // 가짜 API 호출 (3초 대기)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    stopLoading();
    alert('저장 완료!');
  };

  // 예제 2: withLoading 사용 (자동으로 로딩 제어)
  const handleAutoLoading = async () => {
    await withLoading(async () => {
      // 가짜 API 호출 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('처리 완료!');
    }, '처리 중...');
  };

  // 예제 3: Mutation과 함께 사용
  const saveMutation = useAutoMutation('/api/save', 'POST', {
    onMutate: () => {
      startLoading('저장 중...');
    },
    onSuccess: () => {
      stopLoading();
      alert('저장 성공!');
    },
    onError: () => {
      stopLoading();
      alert('저장 실패!');
    },
  });

  const handleSaveWithMutation = () => {
    saveMutation.mutate({ data: 'example' });
  };

  // 예제 4: 순차적인 여러 작업
  const handleMultipleSteps = async () => {
    try {
      startLoading('1단계: 데이터 검증 중...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      startLoading('2단계: 데이터 전송 중...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      startLoading('3단계: 완료 처리 중...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      stopLoading();
      alert('모든 단계 완료!');
    } catch (error) {
      stopLoading();
      alert('오류 발생!');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        전역 로딩 스피너 예제
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔄 기본 사용법
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleManualLoading}>
            수동 로딩 (3초)
          </Button>
          <Button variant="contained" color="secondary" onClick={handleAutoLoading}>
            자동 로딩 (2초)
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔗 Mutation과 함께 사용
        </Typography>
        <Button variant="contained" color="success" onClick={handleSaveWithMutation}>
          저장하기 (Mutation)
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 다단계 작업
        </Typography>
        <Button variant="contained" color="info" onClick={handleMultipleSteps}>
          다단계 처리 (메시지 변경)
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          💡 코드 예제
        </Typography>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
{`// 1. Hook import
import { useLoading } from '@/hooks/useLoading';

function MyComponent() {
  const { startLoading, stopLoading, withLoading } = useLoading();

  // 방법 1: 수동 제어
  const handleSave = async () => {
    startLoading('저장 중...');
    try {
      await saveData();
    } finally {
      stopLoading();
    }
  };

  // 방법 2: 자동 제어 (권장)
  const handleSave = async () => {
    await withLoading(
      async () => await saveData(),
      '저장 중...'
    );
  };

  // 방법 3: Mutation과 함께
  const mutation = useAutoMutation('/api/save', 'POST', {
    onMutate: () => startLoading('저장 중...'),
    onSuccess: () => stopLoading(),
    onError: () => stopLoading(),
  });
}`}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="body2" color="info.contrastText">
          ℹ️ <strong>중요:</strong> 로딩 스피너는 현재 탭 영역 내에만 표시됩니다.
          모달 내에서 로딩을 시작하면 해당 모달 내에만 표시됩니다.
        </Typography>
      </Paper>
    </Box>
  );
};

