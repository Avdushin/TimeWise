import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Box,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Header } from "@/Components/Features/Layouts";
import { $host } from "@/Services/instance";
import { PathsDashboard } from "@/Components/App/Routing";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Используем $host для запроса авторизации
      const response = await $host.post("/api/login", {
        email,
        password,
      });
      console.log("User logged in:", response.data);

      // Сохраняем токен, если он возвращается сервером
      if (response.data) {
        localStorage.setItem("token", response.data.token);
      }

      // Перенаправляем пользователя на главную страницу после успешной авторизации
      navigate(PathsDashboard.Main);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Box pt={70} w={{ base: "90%", sm: "40%" }} m={"0px auto"}>
          <Title style={{ textAlign: "center", paddingBottom: "20px" }}>
            Авторизация
          </Title>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Login</Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Login;
