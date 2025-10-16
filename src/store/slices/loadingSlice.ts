import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type MessageType = "save" | "delete" | "update" | "search";

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  messageType?: MessageType;
}

const initialState: LoadingState = {
  isLoading: false,
  message: undefined,
  messageType: "save",
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string | undefined | MessageType>) => {
      state.isLoading = true;
      state.message   = action.payload;
      state.messageType = action.payload as MessageType;
  
      if (!state.message && state.messageType) {
        if (state.messageType === "save") {
          state.message = "저장 중...";
        } else if (state.messageType === "delete") {
          state.message = "삭제 중...";
        } else if (state.messageType === "update") {
          state.message = "수정 중...";
        } else if (state.messageType === "search") {
          state.message = "검색 중...";
        }
      }
    },
    hideLoading: (state) => {
      state.isLoading = false;
      state.message = undefined;
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

