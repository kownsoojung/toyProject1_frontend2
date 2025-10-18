// Header.tsx
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material";
import { useLayoutContext } from "@/contexts/LayoutContext";
import Breadcrumbs from "./Breadcrumbs";

const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();

  const handleToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
        <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        color: "text.primary",
        boxShadow: "0 2px 8px #f0f1f2",
        transition: "all 0.2s ease",
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 2 }}>
        <IconButton edge="start" onClick={handleToggle} sx={{ mr: 2, fontSize: 20 }}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs />
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Header;
