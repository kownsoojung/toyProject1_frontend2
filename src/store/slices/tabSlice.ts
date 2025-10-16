import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TabItem = {
  key: string;
  title: string;
  Component?: React.ComponentType<any>;
  closable?: boolean;
  loading?: boolean;
};

interface TabState {
  tabs: TabItem[];
  activeKey: string;
}

const initialState: TabState = {
  tabs: [{ key: "dashboard", title: "Dashboard", closable: false }],
  activeKey: "dashboard",
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<TabItem>) => {
      const tab = action.payload;
      const existingTab = state.tabs.find(t => t.key === tab.key);
      if (!existingTab) {
        state.tabs.push(tab);
      }
      state.activeKey = tab.key;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      state.tabs = state.tabs.filter(t => t.key !== key);
      
      // 현재 활성 탭이 제거되면 마지막 탭으로 이동
      if (state.activeKey === key) {
        const lastTab = state.tabs[state.tabs.length - 1];
        state.activeKey = lastTab?.key || "";
      }
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.activeKey = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      const tab = state.tabs.find(t => t.key === key);
      if (tab) {
        tab.loading = loading;
      }
    },
  },
});

export const { addTab, removeTab, setActive, setLoading } = tabSlice.actions;
export default tabSlice.reducer;

