// src/layout/Sidebar/SidebarSubmenu.tsx
import { useState, ReactNode, Fragment } from "react";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface Props {
  text: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const SidebarSubmenu = ({ text, children, defaultOpen = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Fragment>
      <ListItemButton onClick={() => setOpen(prev => !prev)}>
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>{children}</List>
      </Collapse>
    </Fragment>
  );
};

export default SidebarSubmenu;
