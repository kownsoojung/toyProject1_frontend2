import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useEffect } from "react"; // ⭐ useEffect 추가
import { useLayoutContext } from "@/contexts/LayoutContext";
import { SIDEBAR_WIDTH } from "../constants";
import { MENU_DATA } from "@/config/menu";

interface SidebarProps {
  onMenuClick?: (path: string, name: string, id: number) => void;
  activeKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, activeKey }) => {
  const menus = MENU_DATA;
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { sidebarOpen } = useLayoutContext();
  const theme = useTheme();

  // ⭐ isOpen이 true인 메뉴들을 초기에 열어둠
  useEffect(() => {
    if (menus.length > 0 && openKeys.length === 0) {
      const initiallyOpenMenus = menus
        .filter((menu) => menu.isOpen === true)
        .map((menu) => menu.id.toString());
      
      if (initiallyOpenMenus.length > 0) {
        setOpenKeys(initiallyOpenMenus);
      }
    }
  }, []); // ⭐ 의존성 배열 수정

  // 현재 활성화된 탭 key 추출 (예: "/123-/dashboard" → "123-/dashboard")
  const currentPath = location.pathname;

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderMenuTree = (parentId: number = 0, level: number = 0) => {
    return menus
      .filter((menu) => menu.upperId === parentId)
      .sort((a, b) => (a.seq || 0) - (b.seq || 0)) // ⭐ seq로 정렬 추가
      .map((menu) => {
        const childrenMenus = menus
          .filter((m) => m.upperId === menu.id)
          .sort((a, b) => (a.seq || 0) - (b.seq || 0)); // ⭐ 하위 메뉴도 정렬
        const hasChild = childrenMenus.length > 0;
        const isOpen = openKeys.includes(menu.id.toString());

        // MainLayout과 동일한 key 포맷 (id-path)
        const menuKey = `${menu.id}-${menu.path}`;
        const isActive = activeKey === menuKey;

        if (hasChild) {
          return (
            <Box key={menu.id}>
              <ListItemButton
                onClick={() => handleToggle(menu.id.toString())}
                sx={{
                  pl: 2 + level * 2,
                  color: theme.palette.text.primary,
                  bgcolor: isOpen
                    ? theme.palette.action.selected
                    : "transparent",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemText
                  primary={menu.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderMenuTree(menu.id, level + 1)}
                </List>
              </Collapse>
            </Box>
          );
        }

        // ✅ 일반 메뉴 - 선택 시 강조 (테마 기반)
        return (
          <ListItemButton
            key={menuKey}
            selected={isActive}
            sx={{
              pl: 2 + level * 2,
              position: "relative",
              transition: "all 0.2s ease",
              borderRadius: "4px",
              mx: 1,
              my: 0.3,
              color: isActive
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              bgcolor: isActive
                ? theme.palette.primary.main
                : "transparent",
              fontWeight: isActive ? 600 : 400,
              boxShadow: isActive
                ? "inset 4px 0 0 0 " + theme.palette.primary.dark
                : "none",
              "&:hover": {
                bgcolor: isActive
                  ? theme.palette.primary.main
                  : theme.palette.action.hover,
              },
            }}
            onClick={() => {
              if (onMenuClick && menu.id)
                onMenuClick(menu.path, menu.name, menu.id);
            }}
          >
            <ListItemText
              primary={menu.name}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        );
      });
  };

  return (
    <Box
      sx={{
        width: sidebarOpen ? SIDEBAR_WIDTH : 0,
        display: sidebarOpen ? "block" : "none",
        overflowY: "auto",
        height: "100%",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Divider />
      <Box sx={{ overflow: "auto" }}>
        <List>{renderMenuTree()}</List>
      </Box>
    </Box>
  );
};

export default Sidebar;