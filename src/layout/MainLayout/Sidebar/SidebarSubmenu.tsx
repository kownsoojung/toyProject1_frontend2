import { useState, ReactNode, Fragment } from "react";
import { Collapse, ListItemButton, ListItemText, List } from "@mui/material";
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
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {children} {/* 재귀된 하위 메뉴 */}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SidebarSubmenu;
