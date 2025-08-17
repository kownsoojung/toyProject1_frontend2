import { Box, Toolbar, Tabs, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { SIDEBAR_WIDTH } from "./constants";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { Outlet, useNavigate } from "react-router-dom";

type TabItem = {
  key: string; // URL
  title: string;
  closable?: boolean;
};

export default function MainLayout() {
  const { sidebarOpen } = useLayoutContext();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<TabItem[]>([
    { key: "/Dashboard", title: "Dashboard", closable: false },
  ]);
  const [activeKey, setActiveKey] = useState("/Dashboard");

  // CustomEvent로 탭 등록
  useEffect(() => {
    const handleRegisterTab = (e: Event) => {
      const { key, title } = (e as CustomEvent<TabItem>).detail;

      setTabs(prev => {
        if (prev.find(t => t.key === key)) return prev;
        return [...prev, { key, title, closable: true }];
      });

      setActiveKey(key);
      navigate(key); // URL 이동
    };

    window.addEventListener("register-tab", handleRegisterTab);
    return () => window.removeEventListener("register-tab", handleRegisterTab);
  }, [navigate]);

  // 탭 클릭 시 URL 이동
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveKey(newValue);
    navigate(newValue);
  };

  // 탭 닫기
  const handleTabClose = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setTabs(prev => {
      const newTabs = prev.filter(t => t.key !== key);
      if (activeKey === key && newTabs.length > 0) {
        setActiveKey(newTabs[newTabs.length - 1].key);
        navigate(newTabs[newTabs.length - 1].key);
      }
      return newTabs;
    });
  };

  return (
    <>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          transition: theme =>
            theme.transitions.create(["margin"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Header />
        <Toolbar />
        <Tabs
          value={activeKey}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: "divider", minHeight: 40 }}
        >
          {tabs.map(tab => (
            <Tab
              key={tab.key}
              value={tab.key}
              label={
                <Box sx={{ display: "flex", alignItems: "center", minWidth: 80 }}>
                  {tab.title}
                  {tab.closable && (
                    <Box
                      component="span"
                      onClick={e => handleTabClose(e, tab.key)}
                      sx={{
                        ml: 1,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        userSelect: "none",
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Box>
                  )}
                </Box>
              }
              sx={{ minHeight: 40 }}
            />
          ))}
        </Tabs>

        <Box component="main" sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
          {/* 페이지 렌더링은 router가 담당 */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
