// SidebarLink.tsx
import { Menu } from "antd";
import { startTransition } from "react";

interface Props {
  title: string;
  keyName: string;
}

const SidebarLink: React.FC<Props> = ({ title, keyName }) => {
  const handleClick = () => {
    startTransition(() => {
      const event = new CustomEvent("register-tab", {
        detail: { key: keyName, title, path: keyName, Component: undefined }, // 동적 컴포넌트는 나중에 등록 가능
      });
      window.dispatchEvent(event);
    });
  };

  return (
    <Menu.Item key={keyName} title={title} onClick={handleClick}>
      {title}
    </Menu.Item>
  );
};

export default SidebarLink;
