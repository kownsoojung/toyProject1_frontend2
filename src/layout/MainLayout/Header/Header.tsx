// Header.tsx
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material";
import { useLayoutContext } from "@/contexts/LayoutContext";
import useIsMobile from "@/hooks/useIsMobile";
import { SIDEBAR_WIDTH } from "../constants";
import Breadcrumbs from "./Breadcrumbs";

const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const isMobile = useIsMobile();

  const handleToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "#fff",
        color: "text.primary",
        width:"100%",
        ml:  0,
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px #f0f1f2",
        height: 64,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 2 }}>
        {/* 사이드바 토글 버튼 */}
        <IconButton
          edge="start"
          onClick={handleToggle}
          sx={{ mr: 2, fontSize: 20 }}
        >
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>

        {/* Breadcrumb */}
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
