import React, { useState, lazy, Suspense, useRef } from "react";
import { Box, Tabs, Tab, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SIDEBAR_WIDTH } from "./constants";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { TabModalProvider } from "@/hooks/ModalProvider";
import { useTheme } from "@mui/material/styles";
import { GlobalDialog, GlobalToast } from "@/components";
import { useMenus } from "@/hooks/useMenus";
import { TabProvider } from "@/contexts/TabContext";
import { clearTabDialogs } from "@/store/slices/dialogSlice";
import { clearTabToasts } from "@/store/slices/toastSlice";

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
};

const LazyDashboard = lazy(() => import("@/pages/Dashboard"));

export default function MainLayout() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const menus = useAppSelector((state) => state.menu.menus);
  const { sidebarOpen } = useLayoutContext();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const prevActiveKeyRef = useRef<string>("");
  const dialogContainerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = React.useState(false);
  
  // 메뉴 조회
  useMenus();
  
  // 탭 전환 시 이전 탭의 dialog/toast 정리
  React.useEffect(() => {
    if (prevActiveKeyRef.current && prevActiveKeyRef.current !== activeKey) {
      // 이전 탭의 dialog/toast 모두 정리
      dispatch(clearTabDialogs(prevActiveKeyRef.current));
      dispatch(clearTabToasts(prevActiveKeyRef.current));
    }
    prevActiveKeyRef.current = activeKey;
  }, [activeKey, dispatch]);

  // 메뉴가 로드되면 초기 탭 설정
  React.useEffect(() => {
    if (menus.length > 0 && !initialized) {
      const initialMenu = menus.find(menu => menu.id === 1) || menus[0];
      if (initialMenu) {
        const initialTab = {
          key: `${initialMenu.id}-${initialMenu.path}`,
          title: initialMenu.name,
          closable: false,
          component: <LazyDashboard />
        };
        setTabs([initialTab]);
        setActiveKey(initialTab.key);
        setInitialized(true);
      }
    }
  }, [menus, initialized]);

  const modules = import.meta.glob("/src/pages/**/*.tsx");
  const lazyLoad = (path: string) => {
    // path 정규화: 앞에 /가 없으면 추가
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    const importKey = `/src/pages${normalizedPath}.tsx`;
    console.log("🔍 Lazy Load 시도:", { 원본path: path, 정규화된path: normalizedPath, importKey }); // 디버깅용
    console.log("📦 사용 가능한 모듈들:", Object.keys(modules)); // 디버깅용
    
    if (modules[importKey]) {
      const Component = lazy(modules[importKey] as any);
      return (
        <Suspense fallback={
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "100%",
              flexDirection: "column",
              gap: 2
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Box sx={{ color: "text.secondary", fontSize: 14 }}>로딩 중...</Box>
          </Box>
        }>
          <Component />
        </Suspense>
      );
    }
    return <div>Page Not Found: {importKey}</div>;
  };

  const handleMenuClick = (path: string, name: string, id: number | string) => {
    console.log("🖱️ 메뉴 클릭:", { path, name, id }); // 디버깅용
    const tabKey = `${id}-${path}`;
    if (!tabs.find(t => t.key === tabKey)) {
      setTabs(prev => [
        ...prev,
        { key: tabKey, title: name, closable: true, component: lazyLoad(path) }
      ]);
    }
    setActiveKey(tabKey);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => setActiveKey(newValue);

  const handleTabClose = (targetKey: string) => {
    // 탭 닫을 때 해당 탭의 dialog/toast 정리
    dispatch(clearTabDialogs(targetKey));
    dispatch(clearTabToasts(targetKey));
    
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== targetKey);
      if (activeKey === targetKey && newTabs.length > 0) {
        const next = newTabs[newTabs.length - 1];
        setActiveKey(next.key);
      }
      // 최소 1개 탭은 유지
      if (newTabs.length === 0 && menus.length > 0) {
        const initialMenu = menus.find(menu => menu.id === 1) || menus[0];
        const fallbackTab = {
          key: `${initialMenu.id}-${initialMenu.path}`,
          title: initialMenu.name,
          closable: false,
          component: <LazyDashboard />
        };
        setActiveKey(fallbackTab.key);
        return [fallbackTab];
      }
      return newTabs;
    });
  };

  // 메뉴가 아직 로드되지 않았으면 로딩 표시
  if (menus.length === 0 || tabs.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Box sx={{ color: "text.secondary", fontSize: 14 }}>메뉴 로딩 중...</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 1600,
        height: "100vh",
        maxHeight: "100vh",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {/* Header - 최상단 */}
      <Box sx={{ flexShrink: 0, width: "100%" }}>
        <Header />
      </Box>

      {/* Sidebar + Main 영역 */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarOpen ? SIDEBAR_WIDTH : 0,
            transition: "width 0.3s",
            flexShrink: 0,
          }}
        >
          <Sidebar onMenuClick={handleMenuClick} activeKey={activeKey} />
        </Box>

        {/* Main - Tabs + Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%",
          }}
        >
          {/* Tabs */}
          <Box sx={{ flexShrink: 0 }}>
            <Tabs
              value={activeKey}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: "#f0f0f0",
                borderBottom: "1px solid #ccc",
                minHeight: 40,
                marginTop: 0.3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  paddingX: 1,
                  minWidth: 80,
                  minHeight: 36,
                  borderRadius: 1,
                  border: "1px solid #ccc",
                  borderBottom: "none",
                  bgcolor: "#e0e0e0",
                  color: "#333",
                  "&.Mui-selected": {
                    bgcolor: "#fff",
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                  },
                  "&:hover": {
                    bgcolor: "#d9d9d9"
                  }
                }
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  value={tab.key}
                  label={
                    tab.closable ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          minWidth: 80,
                        }}
                      >
                        <span>{tab.title}</span>
                        <IconButton
                          component="span" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTabClose(tab.key);
                          }}
                          sx={{
                            ml: 0.5,
                            p: 0,
                            width: 20,
                            height: 20,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      tab.title
                    )
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            ref={dialogContainerRef}
            sx={{
              flexGrow: 1,
              height: 0,
              overflowY: "auto",
              overflowX: "hidden",
              bgcolor: "#fff",
              paddingBottom: 2,
              position: "relative",
              transform: 'translateZ(0)',
            }}
          >
            {tabs.map((tab) => (
                <Box
                  role="tabpanel"
                  hidden={activeKey !== tab.key}
                  id={tab.key}
                  key={tab.key}
                  sx={{
                        display: activeKey === tab.key ? "flex" : "none",
                        flexDirection: "column",
                        flex: 1,        // 부모 높이를 다 채움
                       
                        overflow: "hidden",
                        position: "relative",
                        height: "100%",
                  }}
                >
                  <TabProvider tabKey={tab.key}>
                    <TabModalProvider>
                      <Box sx={{  flex: 1, overflowY: "auto", position: "relative", height: "100%", overflowX: 'hidden', }}>
                        {tab.component}
                      </Box>
                      {/* ⭐ 각 탭마다 독립적인 Dialog/Toast */}
                      {activeKey === tab.key && (
                        <>
                          <GlobalDialog container={dialogContainerRef.current} tabKey={tab.key} />
                          <GlobalToast container={dialogContainerRef.current} tabKey={tab.key} />
                        </>
                      )}
                    </TabModalProvider>
                  </TabProvider>
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
