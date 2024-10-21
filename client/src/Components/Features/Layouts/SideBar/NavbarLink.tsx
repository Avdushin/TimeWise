//@ts-nocheck
import { jwtDecode } from "jwt-decode";
import { Tooltip, UnstyledButton, rem, Loader } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./SideBar.module.scss";
import { useEffect, useState } from "react";

export interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  href?: string;
  active?: boolean;
  onClick?(): void;
  adminOnly?: boolean;
}

export function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  href,
  adminOnly = false,
}: NavbarLinkProps) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded && decoded?.Auth && decoded.Auth.role) {
        setUserRole(decoded?.Auth?.role);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Loader />
      </div>
    );
  }

  const isAdmin = userRole === "admin";
  const shouldRender = adminOnly ? isAdmin : true;

  if (!shouldRender) {
    return null;
  }

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Link
          to={href ? href : "#"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Icon stroke={1.5} />
          {/* style={{ width: rem(20), height: rem(20) }} */}
        </Link>
      </UnstyledButton>
    </Tooltip>
  );
}
