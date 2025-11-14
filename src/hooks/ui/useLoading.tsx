import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { showLoading, hideLoading, MessageType } from '@/store/slices/loadingSlice';

/**
 * 전역 로딩 스피너를 사용하기 위한 Hook
 * 
 * @example
 * const { startLoading, stopLoading, withLoading } = useLoading();
 * 
 * // 수동으로 제어
 * startLoading('저장 중...');  // 커스텀 메시지
 * startLoading('save');        // MessageType 사용
 * await saveData();
 * stopLoading();
 * 
 * // 자동으로 제어 (권장)
 * await withLoading(saveData, 'save');
 * await withLoading(deleteData, 'delete');
 * await withLoading(updateData, '데이터 업데이트 중...');
 */
export const useLoading = () => {
  const dispatch = useAppDispatch();

  // 로딩 시작
  const startLoading = useCallback((messageOrType?: string | MessageType) => {
    dispatch(showLoading(messageOrType));
  }, [dispatch]);

  // 로딩 종료
  const stopLoading = useCallback(() => {
    dispatch(hideLoading());
  }, [dispatch]);

  // 비동기 함수 실행 중 로딩 표시
  const withLoading = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    messageOrType?: string | MessageType
  ): Promise<T> => {
    try {
      dispatch(showLoading(messageOrType));
      const result = await asyncFn();
      return result;
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  return {
    startLoading,
    stopLoading,
    withLoading,
  };
};

