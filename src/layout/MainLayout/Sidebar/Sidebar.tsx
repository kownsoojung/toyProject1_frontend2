
import { useLocation } from "react-router-dom";
import { useMenuStore } from "@/stores/menuStore";
import { Divider, List, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
const Sidebar = () => {
  
  const menus = useMenuStore((state) => state.menus); 
  const location = useLocation();

  // Antd MenuItem 타입 정의
  type AntdMenuItem = Required<MenuProps>["items"][number];

  const renderMenuTree = (parentId: number = 0): AntdMenuItem[] => {
    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const childrenMenus = menus.filter(m => m.upperId === menu.id);
        const hasChild = childrenMenus.length > 0;
        const defaultOpen = hasChild && childrenMenus.some(c => c.path === location.pathname);

        if (hasChild) {
          return {
            key: menu.id.toString(),
            label: menu.name,
            children: renderMenuTree(menu.id),
          } as AntdMenuItem;
        }

        // URL 변경 없이 탭 등록만
        return {
          key: menu.path || `menu-${menu.id}`,
          label: menu.name,
        } as AntdMenuItem;
      }) || [];
  };

  const defaultOpenKeys = menus
    ?.filter(
      (m) =>
        m.upperId === 0 &&
        menus.some((c) => c.upperId === m.id && c.path === location.pathname)
    )
   .map((m) => m.id.toString()) || [];

  return (
    <Sider width={240}>
      <Divider />
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={defaultOpenKeys}
        items={renderMenuTree()}
      />
    </Sider>
  );
};

export default Sidebar;
