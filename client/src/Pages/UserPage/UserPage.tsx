//@ts-nocheck
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Title,
  Stack,
  Text,
  Flex,
  Divider,
  LoadingOverlay,
  Anchor,
  Breadcrumbs,
  Button,
  Box,
  Paper,
  Collapse,
  Slider,
} from "@mantine/core";
import axios from "axios";
import { AdminPaths } from "@/Components/App/Routing";
import { createPdf } from "./CreatePDF";
import { $host } from "@/Services/instance";
import { useDisclosure } from "@mantine/hooks";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [beckResult, setBeckResult] = useState(null);
  const [backTtestResult, setBackTestResult] = useState(null);
  const [depressionLevel, setDepressionLevel] = useState(null);
  const [color, setColor] = useState(null);
  const [opened, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await $host.get(`/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading || !user) {
    return (
      <LoadingOverlay
        visible={true}
        overlayProps={{ radius: "lg", blur: 20 }}
      />
    );
  }

  const items = [
    { title: "Панель администратора", href: AdminPaths.Panel },
    { title: "Пользователи", href: AdminPaths.Users },
    { title: `${user?.auth?.username}`, href: "" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Stack gap="lg" p="lg" pb={140}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          m={{ base: "0px auto", sm: "0px" }}
        >
          <Title order={2}>
            Профиль пользователя <b>{user.auth.username}</b>
          </Title>
          <Button ml="auto" onClick={() => createPdf(user)}>
            Скачать PDF
          </Button>
        </Flex>
        <Divider />

        {user.auth.role === "admin" && (
          <>
            <Breadcrumbs style={{ flexWrap: "wrap", gap: 10 }}>
              {items}
            </Breadcrumbs>
            <Divider />
          </>
        )}

        <Stack gap="lg">
          {/* Auth Information */}
          <Flex align="center" gap={5}>
            <Text fw={700} size="xl" style={{ minWidth: 100 }}>
              Имя пользователя:
            </Text>
            <Text>{user?.auth?.username || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Email:
            </Text>
            <Text>{user?.auth?.email || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Роль:
            </Text>
            <Text>{user?.auth?.role || "Нет данных"}</Text>
          </Flex>

          {/* Personal Information */}
          <Title order={3}>Персональные данные</Title>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Имя:
            </Text>
            <Text>{user?.personal?.name || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Фамилия:
            </Text>
            <Text>{user?.personal?.surname || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Отчество:
            </Text>
            <Text>{user?.personal?.patronymic || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Дата рождения:
            </Text>
            <Text>{user?.personal?.birthday || "Нет данных"}</Text>
          </Flex>

          {/* Location Information */}
          <Title order={3}>Контактная информация</Title>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Телефон:
            </Text>
            <Text>{user?.personal?.phone || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Страна:
            </Text>
            <Text>{user?.location?.country || "Нет данных"}</Text>
          </Flex>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Город:
            </Text>
            <Text>{user?.location?.city || "Нет данных"}</Text>
          </Flex>

          {/* Tasks */}
          {/* <Title order={3}>Задачи</Title>
          <Stack>
            {user.tasks.map((task) => (
              <Paper key={task.id} withBorder shadow="md" p="md" radius="md">
                <Text>Задача: {task.title}</Text>
                <Text>Описание: {task.description}</Text>
                <Text>Дата выполнения: {task.due_date || "Не указана"}</Text>
                <Text>
                  Статус: {task.is_completed ? "Выполнено" : "Не выполнено"}
                </Text>
              </Paper>
            ))}
          </Stack> */}

          {/* Events */}
          {/* <Title order={3}>События</Title>
          <Stack>
            {user.events.map((event) => (
              <Paper key={event.id} withBorder shadow="md" p="md" radius="md">
                <Text>Событие: {event.title}</Text>
                <Text>Описание: {event.description}</Text>
                <Text>Дата: {event.event_date}</Text>
                <Text>Время: {event.event_time}</Text>
              </Paper>
            ))}
          </Stack> */}
        </Stack>
      </Stack>
    </>
  );
};

export default UserPage;
