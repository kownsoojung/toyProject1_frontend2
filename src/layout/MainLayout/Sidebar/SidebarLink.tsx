import { startTransition } from "react";
import { ListItemButton, ListItemText } from "@mui/material";

interface Props {
  title: string;
  keyName: string;
}

const SidebarLink: React.FC<Props> = ({ title, keyName }) => {
  const handleClick = () => {
    startTransition(() => {
      const event = new CustomEvent("register-tab", {
        detail: { key: keyName, title, path: keyName, Component: undefined },
      });
      window.dispatchEvent(event);
    });
  };

  return (
    <ListItemButton key={keyName} onClick={handleClick}>
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export default SidebarLink;
