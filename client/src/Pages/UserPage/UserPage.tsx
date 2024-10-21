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
import BeckScale from "@/Components/Features/Tests/BeckTest/Share/BeckScale";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [beckResult, setBeckResult] = useState(null);
  const [backTtestResult, setBackTestResult] = useState(null);
  const [depressionLevel, setDepressionLevel] = useState(null);
  const [color, setColor] = useState(null);
  const [opened, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const calculateDepressionLevel = (score) => {
    switch (true) {
      case score <= 13:
        return {
          label: "Минимальная или отсутствующая депрессия",
          color: "green",
        };
      case score <= 19:
        return { label: "Легкая депрессия", color: "yellow" };
      case score <= 28:
        return { label: "Умеренная депрессия", color: "orange" };
      case score >= 29:
        return { label: "Тяжелая депрессия", color: "red" };
      default:
        return { label: "Неопределенный уровень депрессии", color: "gray" };
    }
  };

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

    const fetchBeckResult = async () => {
      try {
        const response = await $host.get(`/api/beck-results/latest/${id}`);
        setBeckResult(response.data);

        const totalScore = getTotalScore(response.data.answers);
        const { label, color } = calculateDepressionLevel(totalScore);
        setDepressionLevel(label);
        setColor(color);
        console.log("Depression level:", depressionLevel);
        console.log("Color:", color);
      } catch (error) {
        console.error("Failed to fetch Beck test results:", error);
      }
    };

    if (id) {
      fetchBeckResult();
    }

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
            Профиль пользователя <b> {user?.auth?.username}</b>
          </Title>
          <Button ml="auto" onClick={() => createPdf(user)}>
            Скачать PDF
          </Button>
        </Flex>
        <Divider />
        {user?.auth?.role === "admin" && (
          <>
            <Breadcrumbs style={{flexWrap: 'wrap', gap: 10}}>{items}</Breadcrumbs>
            <Divider />
          </>
        )}

        <Stack gap="lg">
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
          {/* Персональные данные */}
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
          <Title order={3}>Контактная информация</Title>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Телефон:
            </Text>
            <Text>{user?.personal?.phone || "Нет данных"}</Text>
          </Flex>

          <Title order={3}>Рабочие данные</Title>
          <Flex align="center">
            <Text fw={700} size="sm" style={{ minWidth: 100 }}>
              Должность:
            </Text>
            <Text>{user?.position || "Нет данных"}</Text>
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

          <Title order={3}>Тестирования</Title>
          <Stack>
            <Flex align="center">
              <Text fw={700} size="sm" style={{ minWidth: 100 }}>
                Тип MBTI:
              </Text>
              <Text>{user?.mbti?.type || "Отсутствует"}</Text>
            </Flex>

            <Flex align="center">
              <Text fw={700} size="sm" style={{ minWidth: 100 }}>
                Тест Струпа:
              </Text>
              <Paper withBorder shadow="md" p="md" radius="md">
                <Stack>
                  <Text>Тест №{user?.stroop?.id || "Отсутствует"}</Text>
                  <Text>
                    Кол-во правильных ответов:{" "}
                    {user?.stroop?.correct || "Отсутствует"}
                  </Text>
                  <Text>
                    Кол-во неправильных ответов:{" "}
                    {user?.stroop?.incorrect || "Отсутствует"}
                  </Text>
                </Stack>
              </Paper>
            </Flex>

            {/* {beckResult && ( */}
            <Flex align="center" justify="space-between">
              <Title order={3}>Результаты теста Бека</Title>
              <Button onClick={toggle}>Показать результаты</Button>
            </Flex>

            <Collapse in={opened}>
              {beckResult ? (
                <Box>
                  <Text>Общий балл: {beckResult.totalScore}</Text>
                  <Slider
                    value={beckResult.totalScore}
                    min={0}
                    max={42}
                    label={depressionLevel}
                    marks={[
                      { value: 13, label: "13" },
                      { value: 19, label: "19" },
                      { value: 28, label: "28" },
                      { value: 29, label: "29" },
                      { value: 63, label: "63" },
                    ]}
                    disabled
                    styles={{
                      bar: {
                        backgroundColor: color,
                      },
                    }}
                  />

                  <Text>Ответы:</Text>
                  {Object.entries(beckResult.answers).map(
                    ([questionId, { text, score }]) => (
                      <Text
                        key={questionId}
                      >{`Вопрос ${questionId}: ${text} (Баллы: ${score})`}</Text>
                    )
                  )}
                </Box>
              ) : (
                <Text>Результаты теста Бека не найдены.</Text>
              )}
            </Collapse>
            {/* )} */}

            <Flex align="center" gap={10}>
              <Text fw={700} size="sm" style={{ minWidth: 100 }}>
                Результат СМИЛ:
              </Text>
              {user?.smil?.url ? (
                <Link to={user?.smil?.url}>Смотреть</Link>
              ) : (
                <Text>Не пройден</Text>
              )}
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default UserPage;
