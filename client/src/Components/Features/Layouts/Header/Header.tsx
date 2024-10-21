import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCode,
  IconBook,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Paths, PathsDashboard } from "@/Components/App/Routing";
import logo from "@/assets/ico2.png";
// import logo from '@/assets/fav.png';
import classes from "./Header.module.scss";
import { ThemeToggler } from "../..";
import { APP } from "@/Share/Variables";
import { FC } from "react";
import { useAuth } from "@/Store";

const features = [
  {
    icon: IconCode,
    title: "Open source",
    description: "Исходный код данного сервиса находится в открытом доступе",
    anchor: APP.SOCIAL_MEDIA.GITHUB,
  },
  {
    icon: IconCoin,
    title: "Бесплатно для всех",
    description: "Сервис бесплатынй абсолютно для всех пользователей",
    anchor: PathsDashboard.Main,
  },
  {
    icon: IconBook,
    title: "Документация",
    description: "Сервис имеет обширную документацию",
    anchor: Paths.Documentation,
  },
  {
    icon: IconFingerprint,
    title: "Безопасность",
    description: "Сервис придерживается необходимых мер безопасности",
    anchor: PathsDashboard.Settings,
  },
  // {
  //   icon: IconChartPie3,
  //   title: "Аналитика",
  //   description:
  //     "Сервис поможет специалистам в области психологии и HR провести полную аналитику персонала",
  //   anchor: PathsDashboard.Account,
  // },
];

export const Header: FC = () => {
  // const isAuth = useAuth();
  const isAuth = useAuth((state) => state.isAuth);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = features.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <Link to={item.anchor} target="blank">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon
              style={{ width: rem(22), height: rem(22) }}
              color={theme.colors.blue[6]}
            />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Link>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={20}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to={Paths.Root}>
            <img src={logo} alt="logotype" width={42} />
          </Link>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to={PathsDashboard.Main} className={classes.link}>
              Приложение
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Возможности
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Возможности</Text>
                  <Anchor href={PathsDashboard.Main} fz="xs">
                    Посмотреть всё
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      {/* <Text fw={500} fz='sm'>
                        Начало
                      </Text> */}
                      <Text size="xs" c="dimmed">
                        Все вышеперечисленные функции доступны в приложении
                      </Text>
                    </div>
                    <Link to={PathsDashboard.Main}>
                      <Button variant="default">Попробовать</Button>
                    </Link>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#faq" className={classes.link}>
              Часто задаваемые вопросы
            </a>
            <a href="#reviews" className={classes.link}>
              Отзывы
            </a>
            <a href="#get_in_touch" className={classes.link}>
              Связаться
            </a>
          </Group>
          {/* //TODO fix this sheat */}
          {isAuth == true ? (
            <Flex gap={10} visibleFrom="sm">
              <ThemeToggler size="md" />
              <Link to={PathsDashboard.Account}>
                <ActionIcon variant="default" mt={4}>
                  <IconUserCircle stroke={1.5} />
                </ActionIcon>
              </Link>
            </Flex>
          ) : (
            <Group visibleFrom="sm">
              <ThemeToggler size="lg" />
              <Link to={Paths.Login}>
                <Button variant="default">Вход</Button>
              </Link>
              <Link to={Paths.Signup}>
                <Button>Регистрация</Button>
              </Link>
            </Group>
          )}

          <Group className={classes.mtoggler} visibleFrom="base">
            <ThemeToggler size="md" />
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={APP.FULLNAME}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link to={PathsDashboard.Main} className={classes.link}>
            Приложение
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#faq" className={classes.link}>
            Часто задаваемые вопросы
          </a>
          <a href="#reviews" className={classes.link}>
            Отзывы
          </a>
          <a href="#get_in_touch" className={classes.link}>
            Возможности
          </a>
          <Divider my="sm" />

          {/* //TODO fix this sheat */}
          {isAuth == true ? (
            <Link to={PathsDashboard.Account}>
              <ActionIcon w={"100%"}>
                {/* <IconUserCircle /> */}
                Личный кабинет
              </ActionIcon>
            </Link>
          ) : (
            <Group visibleFrom="sm">
              <ThemeToggler size="lg" />
              <Link to={Paths.Login}>
                <Button variant="default">Вход</Button>
              </Link>
              <Link to={Paths.Signup}>
                <Button>Регистрация</Button>
              </Link>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
