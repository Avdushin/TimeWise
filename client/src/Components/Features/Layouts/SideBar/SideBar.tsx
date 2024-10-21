import { FC } from "react";
import { Box, Center, Stack } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { Paths } from "@/Components/App/Routing";
import { Link } from "@Components/Shared";
import { useAuth, useSidebarStore } from "@/Store";
import { BarItems } from "./BarItems";
import { NavbarLink } from "./NavbarLink";
import classes from "./SideBar.module.scss";
import logo from "@/assets/ico2.png";
// import logo from "@/assets/fav.png";
// import logo from "@/assets/brain.png";

export const NavbarMinimal: FC = () => {
  const activeTab = useSidebarStore((state) => state.activeTab);
  const setActiveTab = useSidebarStore((state) => state.setActiveTab);
  const { loguot } = useAuth();

  const links = BarItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === activeTab}
      onClick={() => setActiveTab(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Link to={Paths.Root}>
          <img className={classes.logo} src={logo} width={50} />
        </Link>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0} className={classes.links}>
          {links}
          <Box  className={classes.mlogout}>
            <NavbarLink icon={IconLogout} label="Выход" onClick={loguot} />
          </Box>
        </Stack>
      </div>

      <Stack justify="center" gap={0} visibleFrom="sm">
        <NavbarLink icon={IconLogout} label="Выйти" onClick={loguot} />
      </Stack>
    </nav>
  );
};
