//@ts-nocheck
import { useState } from "react";
import { useTaskStore } from "@Store/TaskStore";
import { Card, Text, Button, Modal, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const TaskItem = ({ task }) => {
  const { deleteTask, updateTask, completeTask } = useTaskStore();
  const [opened, setOpened] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate || null);

  const handleDelete = async (event) => {
    event.stopPropagation();
    await deleteTask(task.id);
  };

  const handleComplete = async (event) => {
    event.stopPropagation();
    if (!task.isCompleted) {
      await completeTask(task.id);
    }
  };

  const handleEditTask = async () => {
    if (taskTitle.trim()) {
      await updateTask(task.id, {
        ...task,
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDate,
      });
      setOpened(false);
    }
  };

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        style={{
          marginBottom: "10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => setOpened(true)}
      >
        <div>
          <Text>{task.title}</Text>
          <Text color={task.isCompleted ? "green" : "red"}>
            {task.isCompleted ? "Завершено" : "В процессе"}
          </Text>
        </div>
        <div>
          <Button color="green" onClick={handleComplete} size="xs">
            {task.isCompleted ? "Возобновить" : "Завершить"}
          </Button>
          <Button color="red" onClick={handleDelete} size="xs">
            Удалить
          </Button>
        </div>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Изменить задачу"
      >
        <TextInput
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.currentTarget.value)}
          placeholder="Введите новое название задачи"
          required
        />
        <TextInput
          value={taskDescription}
          onChange={(event) => setTaskDescription(event.currentTarget.value)}
          placeholder="Введите описание задачи"
          required
        />
        <DateInput
          value={dueDate}
          onChange={setDueDate}
          placeholder="Выберите срок выполнения"
          label="Срок выполнения"
          clearable
        />
        <Button onClick={handleEditTask} mt="md">
          Сохранить изменения
        </Button>
      </Modal>
    </>
  );
};

export default TaskItem;
