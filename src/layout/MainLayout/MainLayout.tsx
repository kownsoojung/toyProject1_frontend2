import React, { useState, lazy, Suspense } from "react";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
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

  const handleMenuClick = (path: string, name: string, id: number | string) => {
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
            sx={{
              flexGrow: 1,
              height: 0,
              overflowY: "auto",
              bgcolor: "#fff",
              
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
                        minHeight: 600, // 최소 높이
                        overflow: "hidden",
                        position: "relative",
                        height: "100%",
                  }}
                >
                  <TabModalProvider>
                    <Box sx={{  flex: 1, overflowY: "auto", position: "relative", height: "100%" }}>{tab.component}</Box>
                  </TabModalProvider>
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
