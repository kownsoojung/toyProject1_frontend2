import { Link as RouterLink } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { JSX } from "@emotion/react/jsx-runtime";

interface Props {

  title: string;
  to: string;
  icon: JSX.Element;
}

const SidebarLink = ({ title, icon, to }: Props) => {
  const handleClick = () => {
    const event = new CustomEvent("register-tab", {
      detail: {
        key: to,
        title,
        path: to,
      },
    });

    window.dispatchEvent(event);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton component={RouterLink} to={to} onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarLink;