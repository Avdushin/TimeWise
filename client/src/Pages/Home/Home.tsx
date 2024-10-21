import { Paths, PathsDashboard } from "@/Components/App/Routing";
import { FC, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavbarMinimal as Sidebar } from "@/Components/Features/Layouts";
import { Container } from "@mantine/core";

const Home: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === Paths.Dashboard) {
      navigate(PathsDashboard.Main);
    }
  }, [navigate, location]);

  return (
    <>
      <Sidebar />
      <Container size={"lg"}>
        <Outlet />
      </Container>
    </>
  );
};

export default Home;
