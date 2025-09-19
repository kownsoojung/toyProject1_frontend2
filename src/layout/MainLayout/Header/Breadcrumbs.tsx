import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumb } from "antd";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb style={{ margin: "0", color: "#000" }}>
      <Breadcrumb.Item>
        <RouterLink to="/">Home</RouterLink>
      </Breadcrumb.Item>

      {pathnames.map((_, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const last = index === pathnames.length - 1;

        return (
          <Breadcrumb.Item key={to}>
            {last ? (
              <span>{pathnames[index]}</span>
            ) : (
              <RouterLink to={to}>{pathnames[index]}</RouterLink>
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
