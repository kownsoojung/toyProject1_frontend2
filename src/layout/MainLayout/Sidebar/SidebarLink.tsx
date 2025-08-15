// src/layout/Sidebar/SidebarLink.tsx
import { Link as RouterLink } from "react-router-dom";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { startTransition } from "react";

interface Props {
  title: string;
  to: string;
}

const SidebarLink = ({ title, to }: Props) => {
  const handleClick = () => {
    startTransition(() => {
      const event = new CustomEvent("register-tab", {
        detail: { key: to, title, path: to },
      });
      window.dispatchEvent(event);
    });
  };

  return (
    <ListItem disablePadding>
      <ListItemButton component={RouterLink} to={to} onClick={handleClick}>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarLink;
