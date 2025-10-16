import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './slices/menuSlice';
import tabReducer from './slices/tabSlice';
import dialogReducer from './slices/dialogSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    tab: tabReducer,
    dialog: dialogReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // TabItem에 React.ComponentType이 있어서 직렬화 체크 무시
        ignoredActions: ['tab/addTab'],
        ignoredPaths: ['tab.tabs'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

