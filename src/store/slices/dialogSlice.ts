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
        onConfirm: action.payload.onConfirm,  // 콜백 함수 저장
        onCancel: action.payload.onCancel,    // 콜백 함수 저장
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

