import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { showAlert, showConfirm } from '@/store/slices/dialogSlice';
import { showToast } from '@/store/slices/toastSlice';
import { useTabContext } from '@/contexts/TabContext';

/**
 * 전역 Dialog/Toast를 쉽게 사용하기 위한 커스텀 Hook
 */
interface SuccessOptions {
  message?: string;
  type?: "insert" | "update" | "delete" | "save";
}
export const useDialog = () => {
  const dispatch = useAppDispatch();
  const tabContext = useTabContext(); // 현재 탭 키 가져오기
  const tabKey = tabContext?.tabKey;

  // Alert 표시
  const alert = useCallback((message: string, type?: 'success' | 'error' | 'warning' | 'info', title?: string, autoClose?: number) => {
    dispatch(showAlert({ message, type, title, tabKey, autoClose }));
  }, [dispatch, tabKey]);

  // Confirm 표시 (Promise 기반)
  const confirm = useCallback((message: string, title?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch(showConfirm({ 
        message, 
        title,
        tabKey,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      }));
    });
  }, [dispatch, tabKey]);

  // Toast 표시
  const toast = useCallback((message: string, severity?: 'success' | 'error' | 'warning' | 'info', duration?: number) => {
    dispatch(showToast({ message, severity, duration, tabKey }));
  }, [dispatch, tabKey]);

  return {
    alert,
    confirm,
    toast,
    success: ({ message, type }: SuccessOptions) => {
      if (!message && !type) {
        toast("no message", "error");
        return;
      }
     if (type) {
      switch (type) {
        case "insert":
          toast(`등록되었습니다.`, "success");
          break;
        case "update":
          toast(`수정되었습니다.`, "success");
          break;
        case "delete":
          toast(`삭제되었습니다.`, "success");
          break;
        case "save":
          toast(`저장되었습니다.`, "success");
          break;
      }
      return;
     }
     toast(message|| "", "success");
    },
    error: (message: string) => toast(message, 'error'),
    warning: (message: string) => toast(message, 'warning'),
    info: (message: string) => toast(message, 'info'),
  };
};

