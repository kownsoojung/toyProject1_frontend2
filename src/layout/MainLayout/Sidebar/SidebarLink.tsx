import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { startTransition } from "react";

interface Props {
  title: string;
  keyName: string;
}

const SidebarLink = ({ title, keyName }: Props) => {
  const handleClick = () => {
    startTransition(() => {
      const event = new CustomEvent("register-tab", {
        detail: { key: keyName, title, Component: undefined } // 동적 컴포넌트는 나중에 등록 가능
      });
      window.dispatchEvent(event);
    });
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarLink;
