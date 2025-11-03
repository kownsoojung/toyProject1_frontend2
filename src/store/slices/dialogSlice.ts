import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DialogType = 'alert' | 'confirm' | 'success' | 'error' | 'warning' | 'info';

export interface DialogOptions {
  id: string;
  type: DialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  tabKey?: string; // ⭐ 어느 탭에서 발생했는지 추적
  autoClose?: number; // ⭐ 자동으로 닫히는 시간 (밀리초), undefined면 자동으로 닫히지 않음
}

interface DialogState {
  dialogs: DialogOptions[];
}

const initialState: DialogState = {
  dialogs: [],
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ message: string; type?: DialogType; title?: string; tabKey?: string; autoClose?: number }>) => {
      // 중복 방지: 같은 탭의 같은 메시지가 이미 있으면 추가하지 않음
      const isDuplicate = state.dialogs.some(
        d => d.message === action.payload.message && 
             d.type === (action.payload.type || 'info') &&
             d.tabKey === action.payload.tabKey
      );
      
      if (isDuplicate) {
        return; // 중복이면 추가하지 않음
      }
      
      const id = `alert-${Date.now()}-${Math.random()}`;
      state.dialogs.push({
        id,
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        confirmText: '확인',
        tabKey: action.payload.tabKey,
        autoClose: action.payload.autoClose,
      });
    },
    showConfirm: (state, action: PayloadAction<{
      message: string;
      title?: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
      tabKey?: string;
    }>) => {
      // 중복 방지: 같은 탭의 같은 메시지의 confirm이 이미 있으면 추가하지 않음
      const isDuplicate = state.dialogs.some(
        d => d.type === 'confirm' && 
             d.message === action.payload.message &&
             d.tabKey === action.payload.tabKey
      );
      
      if (isDuplicate) {
        return; // 중복이면 추가하지 않음
      }
      
      const id = `confirm-${Date.now()}-${Math.random()}`;
      state.dialogs.push({
        id,
        type: 'confirm',
        title: action.payload.title || '확인',
        message: action.payload.message,
        confirmText: action.payload.confirmText || '확인',
        cancelText: action.payload.cancelText || '취소',
        onConfirm: action.payload.onConfirm,  // 콜백 함수 저장
        onCancel: action.payload.onCancel,    // 콜백 함수 저장
        tabKey: action.payload.tabKey,
      });
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },
    clearAllDialogs: (state) => {
      state.dialogs = [];
    },
    clearTabDialogs: (state, action: PayloadAction<string>) => {
      // 특정 탭의 dialog만 제거
      state.dialogs = state.dialogs.filter(d => d.tabKey !== action.payload);
    },
  },
});

export const { showAlert, showConfirm, closeDialog, clearAllDialogs, clearTabDialogs } = dialogSlice.actions;
export default dialogSlice.reducer;

