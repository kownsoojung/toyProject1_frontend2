import React, { useEffect, useState, lazy, Suspense } from "react";
import { Layout, Menu, Tabs, Breadcrumb } from "antd";
import type { MenuProps, TabsProps } from "antd";
import { useMenuStore } from "@/stores/menuStore";
import { SIDEBAR_WIDTH } from "./constants";
import Header from "./Header";

const { Sider, Content, Footer } = Layout;

type TabItem = {
  key: string;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
};

const LazyDashboard = lazy(() => import("@/pages/Dashboard"));
export default function MainLayout() {
  const menus = useMenuStore((state) => state.menus);
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: "/Dashboard", title: "Dashboard", closable: false, component: <LazyDashboard /> },
  ]);
  const [activeKey, setActiveKey] = useState("/Dashboard");

  // import.meta.glob으로 페이지 lazy import
  const modules = import.meta.glob("/src/pages/**/*.tsx");

  const lazyLoad = (path: string) => {
    const importKey = `/src/pages${path}.tsx`;
    if (modules[importKey]) {
      const Component = lazy(modules[importKey] as any);
      return <Suspense fallback={<div>Loading...</div>}><Component /></Suspense>;
    }
    return <div>Page Not Found</div>;
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const clicked = menus.find((m) => m.path === e.key);
    if (!clicked) return;

    // 탭 없으면 추가
    if (!tabs.find((t) => t.key === clicked.path)) {
      setTabs((prev) => [
        ...prev,
        { key: clicked.path!, title: clicked.name, closable: true, component: lazyLoad(clicked.path!) },
      ]);
    }

    // 탭 전환
    setActiveKey(clicked.path!);
  };

  const handleTabChange: TabsProps["onChange"] = (key) => setActiveKey(key);

  const handleTabEdit: TabsProps["onEdit"] = (targetKey, action) => {
    if (action !== "remove") return;
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.key !== targetKey);
      if (activeKey === targetKey) {
        const next = newTabs[newTabs.length - 1] || { key: "/Dashboard", component: lazyLoad("/Dashboard"), title: "Dashboard" };
        setActiveKey(next.key);
      }
      return newTabs.length ? newTabs : [{ key: "/Dashboard", title: "Dashboard", closable: false, component: lazyLoad("/Dashboard") }];
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
      <Header></Header>

      <Layout style={{ paddingTop: 64 }}>
        <Sider width={SIDEBAR_WIDTH} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            items={renderMenuTree()}
            onClick={handleMenuClick}
            selectedKeys={[activeKey]}
          />
        </Sider>

        <Layout>
          <Content style={{ padding: 8, background: "#f5f5f5", minHeight: "calc(100vh - 64px - 48px)" }}>
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activeKey}
              onChange={handleTabChange}
              onEdit={handleTabEdit}
              tabBarStyle={{ marginBottom: 0 }} 
            >
              {tabs.map((tab) => (
                <Tabs.TabPane key={tab.key} tab={tab.title} closable={tab.closable}>
                  <div style={{ height: "calc(100vh - 64px - 48px - 16px - 40px)", overflowY: "auto", background: "#fff", border: "1px solid #f0f0f0", padding: 8 }}>
                    {tab.component}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Content>
          <Footer style={{ textAlign: "center", height: 48 }}>©2025 My App</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
