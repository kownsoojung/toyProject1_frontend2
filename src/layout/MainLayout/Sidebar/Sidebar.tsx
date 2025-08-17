import { Box, Divider, Drawer, List, Toolbar } from "@mui/material";
import { useLayoutContext } from "@/contexts/LayoutContext";
import useIsMobile from "@/hooks/useIsMobile";
import { SIDEBAR_WIDTH } from "../constants";
import SidebarLink from "./SidebarLink";
import SidebarSubmenu from "./SidebarSubmenu";
import { useMenus } from "@/hooks/useMenus";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const { data: menus } = useMenus();
  const location = useLocation();

  const renderMenuTree = (parentId: number = 0) => {
    if (!menus) return null;

    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const childrenMenus = menus.filter(m => m.upperId === menu.id);
        const hasChild = childrenMenus.length > 0;
        const defaultOpen = hasChild && childrenMenus.some(c => c.path === location.pathname);

        if (hasChild) {
          return (
            <SidebarSubmenu key={menu.id} text={menu.name} defaultOpen={defaultOpen}>
              {renderMenuTree(menu.id)}
            </SidebarSubmenu>
          );
        }

        // URL 변경 없이 탭 등록만
        return (
          <SidebarLink
            key={menu.id}
            keyName={menu.path || `menu-${menu.id}`}
            title={menu.name}
          />
        );
      });
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_WIDTH } }}
    >
      <Box>
        <Toolbar />
        <Divider />
        <List>{renderMenuTree()}</List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
