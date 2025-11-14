import { configureStore } from '@reduxjs/toolkit';
import ctiReducer from './slices/ctiSlice';
import dialogReducer from './slices/dialogSlice';
import loadingReducer from './slices/loadingSlice';
import menuReducer from './slices/menuSlice';
import tabReducer from './slices/tabSlice';
import toastReducer from './slices/toastSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    tab: tabReducer,
    dialog: dialogReducer,
    toast: toastReducer,
    loading: loadingReducer,
    user: userReducer,
    cti: ctiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // TabItem에 React.ComponentType이 있어서 직렬화 체크 무시
        ignoredActions: ['tab/addTab', 'dialog/showConfirm'],
        ignoredPaths: ['tab.tabs', 'dialog.dialogs'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

