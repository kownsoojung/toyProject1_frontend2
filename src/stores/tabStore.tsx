import { create } from "zustand";

type TabItem = {
  key: string;
  title: string;
  Component?: React.ComponentType<any>;
  closable?: boolean;
  loading?: boolean;
};

interface TabStore {
  tabs: TabItem[];
  activeKey: string;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActive: (key: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useTabStore = create<TabStore>(set => ({
  tabs: [{ key: "dashboard", title: "Dashboard", closable: false }],
  activeKey: "dashboard",
  addTab: tab =>
    set(state => ({
      tabs: state.tabs.find(t => t.key === tab.key) ? state.tabs : [...state.tabs, tab],
      activeKey: tab.key
    })),
  removeTab: key =>
    set(state => {
      const newTabs = state.tabs.filter(t => t.key !== key);
      return {
        tabs: newTabs,
        activeKey: state.activeKey === key ? newTabs[newTabs.length - 1]?.key || "" : state.activeKey
      };
    }),
  setActive: key => set({ activeKey: key }),
  setLoading: (key, loading) =>
    set(state => ({
      tabs: state.tabs.map(t => (t.key === key ? { ...t, loading } : t))
    }))
}));
