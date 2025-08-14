import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { SIDEBAR_WIDTH } from "./constants";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useAutoQuery } from "@/hooks/useAutoQuery";

type TabItem = {
  key: string;
  title: string;
  path: string;
};

interface MenuItem {
  id : number;
  upperId : number;
  name : string;
  path : string;
  depth : number;
  children?: MenuItem[];
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen } = useLayoutContext();

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState(location.pathname);


  const { data : menu, isLoading, error } = useAutoQuery<MenuItem[]>('/api/menu/getList');
  
  if (isLoading) return <div>Loading menu...</div>;
  if (error) return <div>Error loading menu: {error.message}</div>;

  // location.pathname 변경될 때마다 탭 추가 (최대 10개)
  useEffect(() => {
    const handleRegisterTab = (e: Event) => {
        const { key, title, path } = (e as CustomEvent<TabItem>).detail;

        setTabs((prevTabs) => {
        const exists = prevTabs.find((tab) => tab.key === key);
        if (exists) return prevTabs;

        if (prevTabs.length >= 10) {
            alert("최대 10개 탭까지 생성할 수 있습니다.");
            return prevTabs;
        }

        return [...prevTabs, { key, title, path }];
        });

        setActiveKey(key);
    };

    window.addEventListener("register-tab", handleRegisterTab);
    return () => window.removeEventListener("register-tab", handleRegisterTab);
    }, []);
  // 탭 클릭 시 이동
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveKey(newValue);
    navigate(newValue);
  };

  // 탭 닫기 처리
  const handleTabClose = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.key !== key);

      if (activeKey === key) {
        // 닫은 탭이 현재 활성 탭이면
        if (newTabs.length > 0) {
          const lastTab = newTabs[newTabs.length - 1];
          setActiveKey(lastTab.key);
          navigate(lastTab.path);
        } else {
          setActiveKey("/");
          navigate("/");
        }
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
          ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          transition: (theme) =>
            theme.transitions.create(["margin"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          flexDirection: "column",
          flexGrow: 1,
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
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              value={tab.key}
              label={
                <Box sx={{ display: "flex", alignItems: "center", minWidth: 80 }}>
                  {tab.title}
                  <Box
                    component="span"
                    onClick={(e) => handleTabClose(e, tab.key)}
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
                </Box>
              }
              sx={{ minHeight: 40 }}
            />
          ))}
        </Tabs>
        
        <Box component="main" sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>

          <Outlet />
        </Box>
      </Box>
    </>
  );
}