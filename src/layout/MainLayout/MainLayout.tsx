import React, { useState, lazy, Suspense } from "react";
import { Box, Tabs, Tab, AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SIDEBAR_WIDTH } from "./constants";
import { useMenuStore } from "@/stores/menuStore";
import { useLayoutContext } from "@/contexts/LayoutContext";

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
};

const LazyDashboard = lazy(() => import("@/pages/Dashboard"));

export default function MainLayout() {
  const menus = useMenuStore((state) => state.menus);
  const { sidebarOpen } = useLayoutContext();
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: "/Dashboard", title: "Dashboard", closable: false, component: <LazyDashboard /> },
  ]);
  const [activeKey, setActiveKey] = useState("/Dashboard");

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

  const handleMenuClick = (path: string, name: string) => {
    if (!tabs.find((t) => t.key === path)) {
      setTabs((prev) => [
        ...prev,
        { key: path, title: name, closable: true, component: lazyLoad(path) },
      ]);
    }
    setActiveKey(path);
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", minWidth:1200}}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box sx={{ display: "flex", flexGrow: 1, pt: "64px" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarOpen ? SIDEBAR_WIDTH : 0,
            transition: "width 0.3s",
            flexShrink: 0,
          }}
        >
          <Sidebar onMenuClick={handleMenuClick} />
        </Box>

        {/* Main */}
        <Box sx={{ flexGrow: 1,  }}>
          {/* Tabs */}
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
                  color: "#1976d2", // 선택된 글자 색
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


          {/* Tab Content */}
          <Box
            sx={{
              p: 2,
              height: `calc(100vh - 64px - 50px)`, // Header(64px) + Tabs(약 48px) 제외
              overflowY: "auto",
              bgcolor: "#fff",
            }}
          >
            {tabs.find((t) => t.key === activeKey)?.component || <div>Page Not Found</div>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
