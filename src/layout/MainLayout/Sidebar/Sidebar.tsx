import { Fragment, useEffect } from "react";
import { Box, Divider, Drawer, List, Toolbar } from "@mui/material";
import { useLayoutContext } from "@/contexts/LayoutContext";
import useIsMobile from "@/hooks/useIsMobile";
import { SIDEBAR_WIDTH } from "../constants";
import SidebarLink from "./SidebarLink";
import SidebarSubmenu from "./SidebarSubmenu";
import { useMenus } from "@/hooks/useMenus";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const { data: menus, isLoading, error } = useMenus();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile, setSidebarOpen]);

  function handleClose() {
    setSidebarOpen(false);
  }

  // 재귀적으로 메뉴 렌더링
  const renderMenuTree = (parentId?: number) => {
    if (!menus) return null;

    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const children = menus.filter(m => m.upperId === menu.id);

        if (children.length > 0) {
          return (
            <SidebarSubmenu key={menu.id} text={menu.name} icon={menu.icon}>
              <List>
                {renderMenuTree(menu.id)}
              </List>
            </SidebarSubmenu>
          );
        }

        return (
          <SidebarLink
            key={menu.id}
            to={menu.path}
            title={menu.name}
            icon={menu.icon}
          />
        );
      });
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={sidebarOpen}
      onClose={handleClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: SIDEBAR_WIDTH,
        },
      }}
    >
      <Box>
        <Toolbar />
        <Divider />
        <List>
          {renderMenuTree()} {/* 최상위 메뉴부터 렌더링 */}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;