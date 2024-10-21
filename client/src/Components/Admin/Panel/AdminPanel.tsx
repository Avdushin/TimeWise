import { AdminPaths } from "@/Components/App/Routing";
import { Card, Button,  Text, Title, Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <>
      <Title  pt={20} mb={20} ta={{base: 'center', sm: 'left'}}>
        Панель администратора
      </Title>
      <Flex gap={20} direction='column' w={'80%'} m={{base: '0px auto', sm: '0px'}}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ flexGrow: 1 }}>
              <Text size="lg" style={{ marginBottom: 10 }}>
                Пользователи
              </Text>
              <Text size="sm" pb={10}>
                Управление пользователями: просмотр списка, удаление,
                редактирование.
              </Text>
            </div>
            <Link
              to={AdminPaths.Users}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="light" style={{ marginTop: "auto" }}>
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
                Тестирования
              </Text>
              <Text size="sm" pb={10}>
                Управление тестированиями: настройка, просмотр результатов.
              </Text>
            </div>

            <Link
              to={AdminPaths.Tests}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="light" style={{ marginTop: "auto" }}>
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
                Отделы
              </Text>
              <Text size="sm" pb={10}>
                Управление отделами: создание, редактирование, удаление.
              </Text>
            </div>

            <Link
              to={AdminPaths.Positions}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="light" style={{ marginTop: "auto" }}>
                Перейти
              </Button>
            </Link>
          </Card>
      </Flex>
    </>
  );
};

export default AdminPanel;
