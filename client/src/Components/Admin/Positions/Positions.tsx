import { AdminPaths } from "@/Components/App/Routing";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Flex,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

const Positions = () => {
  const items = [
    { title: "Панель администратора", href: AdminPaths.Panel },
    { title: "Отделы", href: AdminPaths.Positions },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Title ta="center" pt={20} pb={20}>
        Отделы
      </Title>
      <Divider />
      <Breadcrumbs style={{flexWrap: 'wrap', gap: 10}} pt={20} pb={20}>
        {items}
      </Breadcrumbs>
      <Divider />
      <Flex
        pt={20}
        gap={20}
        justify="center"
        direction={{ base: "column", sm: "row" }}
      >
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flexGrow: 1 }}>
            <Text size="lg" style={{ marginBottom: 10 }}>
              Создать отдел
            </Text>
            <Text size="sm" pb={10}>
              Создать новый отдел
            </Text>
          </div>

          <Link
            to={AdminPaths.CreatePosition}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              variant="light"
              style={{ margin: "0px auto", width: "100%" }}
            >
              Перейти
            </Button>
          </Link>
        </Card>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flexGrow: 1 }}>
            <Text size="lg" style={{ marginBottom: 10 }}>
              Список отделов
            </Text>
            <Text size="sm" pb={10}>
              Управление отделами
            </Text>
          </div>

          <Link
            to={AdminPaths.ManagePosition}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              variant="light"
              style={{ margin: "0px auto", width: "100%" }}
            >
              Перейти
            </Button>
          </Link>
        </Card>
      </Flex>
    </>
  );
};

export default Positions;
