import { GlobalDialog, GlobalToast } from "@/components";
import { CallIncomingPopup } from "@/components/Global/CallIncomingPopup";
import { MENU_DATA } from "@/config/menu";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { TabProvider } from "@/contexts/TabContext";
import { TabModalProvider } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearTabDialogs } from "@/store/slices/dialogSlice";
import { clearAllToasts, clearTabToasts } from "@/store/slices/toastSlice";
import { loadUserFromStorage } from "@/store/slices/userSlice";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { lazy, Suspense, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SIDEBAR_WIDTH } from "./constants";
import { useAppInitialization } from "@/hooks";

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
};

const LazyCounselingCall = lazy(() => import("@/pages/counselor/counselingCall"));

export default function MainLayout() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menus = MENU_DATA;
  const { sidebarOpen } = useLayoutContext();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const prevActiveKeyRef = useRef<string>("");
  const dialogContainerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = React.useState(false);
  const user = useAppSelector((state: any) => state.user);

  // 로그인 상태 확인 및 초기화
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    // 토큰이 있지만 Redux store에 사용자 정보가 없는 경우 복원
    if (token && isLoggedIn && (!user.accessToken || !user.id)) {
      console.log("🔄 Redux store에 사용자 정보 없음 - localStorage에서 복원");
      dispatch(loadUserFromStorage());
    }
    
    // 토큰이 없는 경우 로그인 페이지로 리다이렉트
    if (!token || !isLoggedIn) {
      console.log("⚠️ 인증 정보 없음 - 로그인 페이지로 이동");
      navigate("/login", { replace: true });
      return;
    }
    
    // 사용자 정보가 여전히 없는 경우 리다이렉트
    if (!user.accessToken && !user.id && !user.userId) {
      console.log("⚠️ 사용자 정보 없음 - 로그인 페이지로 이동");
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate, user.accessToken, user.id, user.userId]);

  
  // 앱 초기화 (설정 조회 + CTI 연결)
  useAppInitialization();
  
  // 로그인 성공 toast를 메인 화면에서 한 번만 표시하고 제거
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearAllToasts());
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
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
      const initialMenu = menus.find((menu: any) => menu.id === 3) || menus[0];
      if (initialMenu) {
        const initialTab = {
          key: `${initialMenu.id}-${initialMenu.path}`,
          title: initialMenu.name,
          closable: false,
          component: <LazyCounselingCall />
        };
        setTabs([initialTab]);
        setActiveKey(initialTab.key);
        setInitialized(true);
      }
    }
  }, [menus, initialized]);

  const modules = import.meta.glob([
    "/src/pages/**/*.tsx",
  ]);
  const lazyLoad = (path: string) => {
    // path 정규화: 앞에 /가 없으면 추가
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    const importKey = `/src/pages${normalizedPath}.tsx`;
    
    if (modules[importKey]) {
      const Component = lazy(modules[importKey] as any);
      return <Component />;
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
        const initialMenu = menus.find((menu: any) => menu.id === 1) || menus[0];
        const fallbackTab = {
          key: `${initialMenu.id}-${initialMenu.path}`,
          title: initialMenu.name,
          closable: false,
          component: <LazyCounselingCall />
        };
        setActiveKey(fallbackTab.key);
        return [fallbackTab];
      }
      return newTabs;
    });
  };

  // 메뉴가 아직 로드되지 않았으면 로딩 표시
  if (menus.length === 0 || tabs.length === 0) {
    const isLoggedIn = user?.accessToken || user?.userId;
    const loadingMessage = isLoggedIn ? "메뉴 로딩 중..." : "초기화 중..."; // ⭐ 또는 원하는 메시지
    
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
        <Box sx={{ color: "text.secondary", fontSize: 14 }}>{loadingMessage}</Box>
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
                      <Suspense fallback={
                        <Box 
                          sx={{ 
                            display: "flex", 
                            justifyContent: "center", 
                            alignItems: "center", 
                            minHeight: 200,
                            flexDirection: "column",
                            gap: 2
                          }}
                        >
                          <CircularProgress size={50} thickness={4} />
                          <Box sx={{ color: "text.secondary", fontSize: 14 }}>로딩 중...</Box>
                        </Box>
                      }>
                        <Box sx={{  flex: 1, overflowY: "auto", position: "relative", height: "100%", overflowX: 'hidden', }}>
                          {tab.component}
                        </Box>
                      </Suspense>
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
      
      {/* 전역 콜 팝업 - 모든 페이지에서 작동 */}
      <CallIncomingPopup />
      
      {/* ⭐ 전체 화면 기준 Dialog/Toast - 헤더/메인에서 사용하는 전역 팝업 (로그인 성공 등) */}
      <GlobalDialog tabKey={undefined} />
      <GlobalToast tabKey={undefined} />
    </Box>
  );
}
