// Header.tsx
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLayoutContext } from "@/contexts/LayoutContext";
import useIsMobile from "@/hooks/useIsMobile";
import { SIDEBAR_WIDTH } from "../constants";
import Breadcrumbs from "./Breadcrumbs";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const isMobile = useIsMobile();

  const handleToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        width: `calc(100% - ${sidebarOpen && !isMobile ? SIDEBAR_WIDTH : 0}px)`,
        marginLeft: sidebarOpen && !isMobile ? SIDEBAR_WIDTH : 0,
        transition: "all 0.2s",
        background: "#fff",
        zIndex: 1000,
        boxShadow: "0 2px 8px #f0f1f2",
        position: "fixed",
        top: 0,
        left: 0,
        height: 64, // 고정 높이
      }}
    >

      <Button
        type="text"
        icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={handleToggle}
        style={{ fontSize: 20, marginRight: 16 }}
      />
      <Breadcrumbs />
    </AntHeader>
  );
};

export default Header;
