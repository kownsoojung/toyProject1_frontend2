import { useState, ReactNode, Fragment } from "react";
import {
  Collapse,
  ListItemButton,
  ListItemText,
  List,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface Props {
  text: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const SidebarSubmenu: React.FC<Props> = ({ text, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Fragment>
      <ListItemButton
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          pl: 2,
          "&.Mui-selected": {
            backgroundColor: "action.selected",
            fontWeight: 600,
          },
        }}
      >
        <ListItemText primary={text} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 3 }}>
          {children} {/* 재귀 하위 메뉴 */}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SidebarSubmenu;
