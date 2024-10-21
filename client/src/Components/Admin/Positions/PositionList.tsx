//@ts-nocheck
import { useState, useEffect } from "react";
import {
  Table,
  Text,
  Anchor,
  Button,
  Divider,
  Breadcrumbs,
} from "@mantine/core";
import { $host } from "@/Services/instance";
import { AdminPaths } from "@/Components/App/Routing";

const PositionList = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await $host.get("/api/sections");
      const data = await response.data;
      setPositions(data);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await $host.delete(`/api/sections/${id}`);
      fetchPositions();
    } catch (error) {
      console.error("Failed to delete position:", error);
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
    <>
      <Text size="xl" fw={700} pt={20} mb={20}>
        Список должностей
      </Text>
      <Divider />
      <Breadcrumbs pt={20} pb={20}  style={{flexWrap: 'wrap', gap: 10}}>
        {items}
      </Breadcrumbs>
      <Divider />
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Название должности</Table.Th>
            <Table.Th>Дата создания</Table.Th>
            <Table.Th>Дата обновления</Table.Th>
            <Table.Th>Действия</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <tbody>
          {positions.map((position) => (
            <Table.Tr key={position.id}>
              <Table.Td>{position.id}</Table.Td>
              <Table.Td>{position.name}</Table.Td>
              <Table.Td>
                {new Date(position.CreatedAt).toLocaleString()}
              </Table.Td>
              <Table.Td>
                {new Date(position.UpdatedAt).toLocaleString()}
              </Table.Td>
              <Table.Td>
                <Button
                  onClick={() => handleDeletePosition(position.id)}
                  color="red"
                >
                  Удалить
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default PositionList;
