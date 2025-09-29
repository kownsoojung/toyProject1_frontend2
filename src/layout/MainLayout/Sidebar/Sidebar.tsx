import { useLocation } from "react-router-dom";
import { useMenuStore } from "@/stores/menuStore";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Toolbar,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { SIDEBAR_WIDTH } from "../constants";

const drawerWidth = 240;

interface SidebarProps {
  onMenuClick?: (path: string, name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
  const menus = useMenuStore((state) => state.menus);
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderMenuTree = (parentId: number = 0, level: number = 0) => {
    return menus
      .filter((menu) => menu.upperId === parentId)
      .map((menu) => {
        const childrenMenus = menus.filter((m) => m.upperId === menu.id);
        const hasChild = childrenMenus.length > 0;
        const isOpen = openKeys.includes(menu.id.toString());

        if (hasChild) {
          return (
            <Box key={menu.id}>
              <ListItemButton
                onClick={() => handleToggle(menu.id.toString())}
                sx={{ pl: 2 + level * 2 }} // level에 따라 들여쓰기
              >
                <ListItemText primary={menu.name} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderMenuTree(menu.id, level + 1)} {/* 하위 메뉴는 level+1 */}
                </List>
              </Collapse>
            </Box>
          );
        }

        return (
          <ListItemButton
            key={menu.path || `menu-${menu.id}`}
            selected={location.pathname === menu.path}
            sx={{ pl: 2 + level * 2 }} // level 기반 들여쓰기
            onClick={() => {
              if (onMenuClick && menu.path) onMenuClick(menu.path, menu.name);
            }}
          >
            <ListItemText primary={menu.name} />
          </ListItemButton>
        );
      });
  };

  return (
    <Box
    sx={{
       width: sidebarOpen ? SIDEBAR_WIDTH : 0,
        
        bgcolor: "#1e1e2f",
        color: "#fff",
        borderRight: "1px solid #2c2c3c",
        display: sidebarOpen ? "block" : "none",
        overflowY: "auto",
        height: "100%", // Body flex에 맞춰서 전체 높이
    }}
  >
      {/* Toolbar로 AppBar 높이만큼 spacer */}
      <Divider />
      <Box sx={{ overflow: "auto" }}>
        <List>{renderMenuTree()}</List>
      </Box>
    </Box>
  );
};

export default Sidebar;
