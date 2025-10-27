import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
  tabKey?: string; // ⭐ 어느 탭에서 발생했는지 추적
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{
      message: string;
      severity?: ToastSeverity;
      duration?: number;
      tabKey?: string;
    }>) => {
      // 중복 방지: 같은 탭의 같은 메시지의 토스트가 이미 있으면 추가하지 않음
      const isDuplicate = state.toasts.some(
        t => t.message === action.payload.message && 
             t.severity === (action.payload.severity || 'info') &&
             t.tabKey === action.payload.tabKey
      );
      
      if (isDuplicate) {
        return; // 중복이면 추가하지 않음
      }
      
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.toasts.push({
        id,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
        duration: action.payload.duration || 3000,
        tabKey: action.payload.tabKey,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    clearTabToasts: (state, action: PayloadAction<string>) => {
      // 특정 탭의 toast만 제거
      state.toasts = state.toasts.filter(t => t.tabKey !== action.payload);
    },
  },
});

export const { showToast, removeToast, clearAllToasts, clearTabToasts } = toastSlice.actions;
export default toastSlice.reducer;

