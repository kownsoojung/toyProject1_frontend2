import React, { useEffect, useState } from "react";
import { Layout, Menu, Tabs, Breadcrumb } from "antd";
import type { MenuProps, TabsProps } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useMenuStore } from "@/stores/menuStore";
import { SIDEBAR_WIDTH } from "./constants";

const { Header, Sider, Content, Footer } = Layout;

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = useMenuStore((state) => state.menus);

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState("");

  // 초기 로드
  useEffect(() => {
    const savedTabs = localStorage.getItem("tabs");
    const savedActive = localStorage.getItem("activeKey");

    if (savedTabs && savedActive) {
      setTabs(JSON.parse(savedTabs));
      setActiveKey(savedActive);
    } else {
      setTabs([{ key: "/Dashboard", title: "Dashboard", closable: false }]);
      setActiveKey("/Dashboard");

      if (location.pathname === "/") {
        navigate("/Dashboard", { replace: true });
      }
    }
  }, []);

  // 저장
  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
    localStorage.setItem("activeKey", activeKey);
  }, [tabs, activeKey]);

 // ✅ 2. 라우터 변경 감지
  useEffect(() => {
    // 이미 Dashboard가 기본 탭이면 또 추가하지 않음
    setActiveKey(location.pathname);

    // 메뉴를 찾을 수 없으면 끝
    const menu = menus.find((m) => m.path === location.pathname);
    if (!menu) return;

    // 같은 key가 없을 때만 추가
    setTabs((prev) => {
      if (prev.some((t) => t.key === menu.path)) return prev;
      return [...prev, { key: menu.path!, title: menu.name, closable: true }];
    });
  }, [location.pathname, menus]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const clicked = menus.find((m) => m.path === e.key);
    if (!clicked) return;
    if (!tabs.find((t) => t.key === clicked.path)) {
      setTabs((prev) => [...prev, { key: clicked.path!, title: clicked.name, closable: true }]);
    }
    setActiveKey(clicked.path!);
    navigate(clicked.path!);
  };

  const handleTabChange: TabsProps["onChange"] = (key) => {
    setActiveKey(key);
    navigate(key);
  };

  const handleTabEdit: TabsProps["onEdit"] = (targetKey, action) => {
    if (action !== "remove") return;
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== targetKey);
      if (activeKey === targetKey) {
        const next = newTabs[newTabs.length - 1] || { key: "/Dashboard" };
        setActiveKey(next.key);
        navigate(next.key);
      }
      return newTabs.length ? newTabs : [{ key: "/Dashboard", title: "Dashboard", closable: false }];
    });
  };

  const renderMenuTree = (parentId = 0): MenuProps["items"] =>
    menus
      .filter((m) => m.upperId === parentId)
      .map((menu) => {
        const children = menus.filter((c) => c.upperId === menu.id);
        return children.length
          ? { key: menu.id.toString(), label: menu.name, children: renderMenuTree(menu.id) }
          : { key: menu.path || `menu-${menu.id}`, label: menu.name };
      });

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 200,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          height: 64,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Breadcrumb style={{ margin: 0 }}>
          <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
          {location.pathname
            .split("/")
            .filter(Boolean)
            .map((path, idx, arr) => (
              <Breadcrumb.Item key={idx}>
                {idx === arr.length - 1
                  ? path
                  : <a href={`/${arr.slice(0, idx + 1).join("/")}`}>{path}</a>}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
      </Header>

      <Layout style={{ paddingTop: 64, overflow: "hidden" }}>
        {/* Sidebar */}
        <Sider
          width={SIDEBAR_WIDTH}
          style={{
            background: "#fff",
            height: "calc(100vh - 64px)",
            overflow: "auto",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={menus
              .filter(
                (m) =>
                  m.upperId === 0 &&
                  menus.some((c) => c.upperId === m.id && c.path === location.pathname)
              )
              .map((m) => m.id.toString())}
            items={renderMenuTree()}
            onClick={handleMenuClick}
          />
        </Sider>

        {/* Content + Footer */}
        <Layout style={{ overflow: "hidden" }}>
          <Content
            style={{
              padding: 8,
              background: "#f5f5f5",
              overflow: "hidden",
              minHeight: "calc(100vh - 64px - 48px)", // 헤더와 푸터 제외
            }}
          >
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activeKey}
              onChange={handleTabChange}
              onEdit={handleTabEdit}
              style={{ marginBottom: 0, height: "100%" }}
              tabBarStyle={{ marginBottom: 0 }} // 탭바 자체 margin 제거
            >
              {tabs.map((tab) => (
                <Tabs.TabPane key={tab.key} tab={tab.title} closable={tab.closable}>
                  <div
                    style={{
                      height: "calc(100vh - 64px - 48px - 16px - 40px)", 
                      // 64: header, 48: footer, 16: content padding, 38: 탭 헤더 높이
                      overflowY: "auto",
                      background: "#fff",
                      border: "1px solid #f0f0f0", // ✅ 상단 선 추가
                      padding: 8, // 선과 내용 간 간격
                    }}
                  >
                    <Outlet />
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Content>

          <Footer style={{ textAlign: "center", background: "#fafafa", height: 48 }}>
            ©2025 My App. All Rights Reserved.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
