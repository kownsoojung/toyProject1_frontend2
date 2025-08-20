import { create } from "zustand";

export interface TabItem {
  key: string;        // 라우터 path
  title: string;      // 탭 제목
  closable?: boolean; // 닫기 버튼 표시 여부
}

interface TabState {
  tabs: TabItem[];
  activeKey: string;
  addTab: (tab: TabItem) => void;
  setActiveKey: (key: string) => void;
  removeTab: (key: string) => void;
  navigate: (path: string) => void; // MainLayout에서 useNavigate 연결
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [{ key: "/Dashboard", title: "Dashboard", closable: false }],
  activeKey: "/Dashboard",
  addTab: (tab) =>
    set((state) => {
      if (state.tabs.find((t) => t.key === tab.key)) return state; // 이미 있으면 그대로
      return { tabs: [...state.tabs, tab] }; // 새 배열 생성
    }),
  setActiveKey: (key) => set({ activeKey: key }),
  removeTab: (key) =>
    set((state) => {
      const tabs = state.tabs.filter((t) => t.key !== key);
      let activeKey = state.activeKey;
      if (activeKey === key) {
        activeKey = tabs.length ? tabs[tabs.length - 1].key : "/Dashboard";
      }
      return { tabs, activeKey };
    }),
  navigate: () => {}, // 초기 더미, MainLayout에서 연결
}));
