import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const BreadcrumbsNav: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ m: 0, color: "#000" }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const last = index === pathnames.length - 1;

        return last ? (
          <Typography key={to} color="text.primary">
            {value}
          </Typography>
        ) : (
          <Link
            key={to}
            component={RouterLink}
            to={to}
            underline="hover"
            color="inherit"
          >
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
