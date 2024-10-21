import { useState } from "react";
import {
  TextInput,
  Button,
  Box,
  Title,
  Notification,
  Anchor,
  Divider,
  Breadcrumbs,
} from "@mantine/core";
import { $host } from "@/Services/instance";
import { AdminPaths } from "@/Components/App/Routing";

const CreatePosition = () => {
  const [sectionName, setSectionName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!sectionName) {
      setError("Название отдела не может быть пустым.");
      return;
    }

    try {
      const response = await $host.post("/api/sections", { name: sectionName });
      if (response.status === 200) {
        setSuccess("Отдел успешно создан.");
        setSectionName("");
      } else {
        setError("Ошибка при создании отдела.");
      }
    } catch (err) {
      setError("Ошибка сервера при создании отдела.");
    }
  };

  const items = [
    { title: "Панель администратора", href: AdminPaths.Panel },
    { title: "Отделы", href: AdminPaths.Positions },
    { title: "Создать отдел", href: AdminPaths.CreatePosition },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Box style={{ maxWidth: 300, margin: "auto" }}>
      <Title order={3} pt={20} mb={20}>Создать новый отдел</Title>
      <Divider />
      <Breadcrumbs  style={{flexWrap: 'wrap', gap: 10}} pt={20} pb={20}>
        {items}
      </Breadcrumbs>
      <Divider />
      {error && <Notification color="red">{error}</Notification>}
      {success && <Notification color="green">{success}</Notification>}
      <TextInput
        label="Название отдела"
        placeholder="Введите название"
        value={sectionName}
        onChange={(event) => setSectionName(event.target.value)}
        required
      />
      <Button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Создать
      </Button>
    </Box>
  );
};

export default CreatePosition;
