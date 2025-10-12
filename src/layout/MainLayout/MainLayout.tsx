import React, { useState, lazy, Suspense } from "react";
import { Box, Tabs, Tab, AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SIDEBAR_WIDTH } from "./constants";
import { useMenuStore } from "@/stores/menuStore";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { TabModalProvider } from "@/hooks/ModalProvider";
import { useTheme } from "@mui/material/styles";

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
};

const LazyDashboard = lazy(() => import("@/pages/Dashboard"));

export default function MainLayout() {
  const theme = useTheme();
  const menus = useMenuStore((state) => state.menus);
  const initialMenu = menus.find(menu => menu.id === 1) || menus[0];
  const { sidebarOpen } = useLayoutContext();
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: `${initialMenu.id}-${initialMenu.path}`, title: initialMenu.name, closable: false, component: <LazyDashboard /> },
  ]);
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  const modules = import.meta.glob("/src/pages/**/*.tsx");
  const lazyLoad = (path: string) => {
    const importKey = `/src/pages${path}.tsx`;
    if (modules[importKey]) {
      const Component = lazy(modules[importKey] as any);
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );
    }
    return <div>Page Not Found</div>;
  };

  const handleMenuClick = (path: string, name: string, id: number |string) => {
     const tabKey = `${id}-${path}`; // id + path로 고유 key 생성
      if (!tabs.find(t => t.key === tabKey)) {
        setTabs(prev => [
          ...prev,
          { key: tabKey, title:name, closable: true, component: lazyLoad(path) }
        ]);
      }
      setActiveKey(tabKey);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => setActiveKey(newValue);

  const handleTabClose = (targetKey: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== targetKey);
      if (activeKey === targetKey) {
        const next = newTabs[newTabs.length - 1] || {
          key: "/Dashboard",
          title: "Dashboard",
          closable: false,
          component: lazyLoad("/Dashboard"),
        };
        setActiveKey(next.key);
      }
      return newTabs.length
        ? newTabs
        : [{ key: "/Dashboard", title: "Dashboard", closable: false, component: lazyLoad("/Dashboard") }];
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 800,  // 바깥 전체 최소 높이
        minWidth: 1600,
        height: "100vh", // 화면보다 작으면 100vh
      }}
    >
      {/* Header */}
      
      
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

        {/* Main */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexShrink: 0 }}>
            <Header />
          </Box>
          {/* Tabs */}
          <Box sx={{ flexShrink: 0 }}>
            <Tabs
              value={activeKey}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: "#f0f0f0", // 탭 바 배경
                borderBottom: "1px solid #ccc",
                minHeight: 40,
                marginTop:0.3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  paddingX: 1,
                  minWidth: 80,
                  minHeight: 36, 
                  borderRadius: 1,
                  border: "1px solid #ccc",
                  borderBottom: "none", 
                  bgcolor: "#e0e0e0", // 기본 탭 배경
                  color: "#333",
                  "&.Mui-selected": {
                    bgcolor: "#fff", // 선택된 탭 배경
                    color: theme.palette.primary.main, // 선택된 글자 색
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
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // 탭 클릭 이벤트 막기
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
            sx={{
              flexGrow: 1,           // 남은 공간을 차지
              height: "calc(100vh - 64px - 48px)", // Header 64px + Tabs 48px
              overflowY: "auto",     // 내용이 넘치면 스크롤
              bgcolor: "#fff",
              
            }}
          >
            {tabs.map( tab =>
               (
                <Box
                  role="tabpanel"
                  hidden={activeKey !== tab.key}
                  id={tab.key}
                  key={tab.key}
                  sx={{
                    height: "100%",           // 부모 높이 100%
                    display: activeKey === tab.key ? "block" : "none",
                    position: "relative",     // 모달이 내부 기준으로 잡히게
                  }}
                >
                  <TabModalProvider>
                  
                  <Box sx={{ height: "100%", overflowY: "auto" }}>{tab.component}</Box>
                </TabModalProvider>
                </Box>
              )
          )}
          
        </Box>
      </Box>
    </Box>
  );
}
