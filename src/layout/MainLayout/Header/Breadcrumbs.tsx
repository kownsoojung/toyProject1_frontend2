import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ color: "primary.contrastText" }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>

      {pathnames.map((_, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const last = index === pathnames.length - 1;

        return last ? (
          <Typography color="inherit" key={to}>
            {pathnames[index]}
          </Typography>
        ) : (
          <Link component={RouterLink} to={to} underline="hover" color="inherit" key={to}>
            {pathnames[index]}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
