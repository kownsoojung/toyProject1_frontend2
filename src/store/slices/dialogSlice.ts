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
    showAlert: (state, action: PayloadAction<{ message: string; type?: DialogType; title?: string }>) => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      state.dialogs.push({
        id,
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        confirmText: '확인',
      });
    },
    showConfirm: (state, action: PayloadAction<{
      message: string;
      title?: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }>) => {
      const id = `confirm-${Date.now()}-${Math.random()}`;
      state.dialogs.push({
        id,
        type: 'confirm',
        title: action.payload.title || '확인',
        message: action.payload.message,
        confirmText: action.payload.confirmText || '확인',
        cancelText: action.payload.cancelText || '취소',
        // 주의: 함수는 Redux state에 저장하면 안되지만, 
        // 여기서는 임시로 저장. 실제로는 콜백 ID를 저장하고 별도 관리 필요
      });
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },
    clearAllDialogs: (state) => {
      state.dialogs = [];
    },
  },
});

export const { showAlert, showConfirm, closeDialog, clearAllDialogs } = dialogSlice.actions;
export default dialogSlice.reducer;

