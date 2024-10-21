//@ts-nocheck
import { useState, useEffect } from "react";
import { TextInput, Button, Box, Title, Notification, Table } from "@mantine/core";
import { $host } from "@/Services/instance";

const Departments = () => {
  const [sectionName, setSectionName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await $host.get("/api/sections");
      if (response.status === 200) {
        setSections(response.data);
      } else {
        setError("Ошибка при загрузке отделов.");
      }
    } catch (err) {
      setError("Ошибка сервера при загрузке отделов.");
    }
  };

  const handleSubmit = async () => {
    if (!sectionName) {
      setError("Название отдела не может быть пустым.");
      return;
    }

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position_name: sectionName }),
      });
      if (response.status === 200) {
        setSuccess("Отдел успешно создан.");
        setSectionName("");
        fetchSections();
      } else {
        setError("Ошибка при создании отдела.");
      }
    } catch (err) {
      setError("Ошибка сервера при создании отдела.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await $host.delete(`/api/sections/${id}`);
      if (response.status === 200) {
        setSuccess("Отдел успешно удален.");
        fetchSections();
      } else {
        setError("Ошибка при удалении отдела.");
      }
    } catch (err) {
      setError("Ошибка сервера при удалении отдела.");
    }
  };

  return (
    <Box style={{ maxWidth: 600, margin: "auto" }} pt={20}>
      <Title order={3}>Создание нового отдела</Title>
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
      <Title order={3} style={{ marginTop: 40 }}>
        Список отделов
      </Title>
      <Table highlightOnHover withColumnBorders style={{ width: "100%", marginTop: 20 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Название отдела</Table.Th>
            <Table.Th>Действия</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {sections.map((section) => (
            <Table.Tr key={section.id}>
              <Table.Td>{section.id}</Table.Td>
              <Table.Td>{section.name}</Table.Td>
              <Table.Td>
                <Button onClick={() => handleDelete(section.id)}>
                  Удалить
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default Departments;
