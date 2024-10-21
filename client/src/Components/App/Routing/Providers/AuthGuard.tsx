//@ts-nocheck
import { Navigate } from "react-router-dom";
import { useAuth } from "@/Store";
import { Loader } from "@mantine/core";
import { Paths, PathsDashboard } from "..";
import { ReactElement, useEffect, useState } from "react";
import { dev } from "@/Utils";
import { jwtDecode } from "jwt-decode";

export type TGuardProps = {
  children: ReactElement;
  isAdmin?: boolean;
};

const AuthGuard = ({ children, isAdmin }: TGuardProps) => {
  const isAuth = useAuth((state) => state.isAuth);
  const isLoading = useAuth((state) => state.loading);
  // const userRole = useAuth(state => state.user?.auth?.role ?? 'user');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded && decoded?.Auth && decoded?.Auth?.role) {
        setUserRole(decoded?.Auth?.role);
      }
    }
  }, []);

  dev.log("AuthGuard: " + isAuth);

  if (isLoading) {
    return (
      <div className="loading-skeleton">
        <Loader />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to={Paths.Login} />;
  } else if (isAdmin && userRole !== "admin") {
    return;
  }

  return children;
};

export { AuthGuard };
