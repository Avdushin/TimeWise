//@ts-nocheck
import { useState } from "react";
import { useTaskStore } from "@Store/TaskStore";
import { Button, Modal, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const CreateTask = () => {
  const { createTask } = useTaskStore();
  const [opened, setOpened] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const handleCreateTask = async () => {
    if (taskTitle.trim()) {
      await createTask({
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDate,
        isCompleted: false,
      });
      setOpened(false);
      setTaskTitle("");
      setTaskDescription("");
      setDueDate(null);
    }
  };

  return (
    <>
      <Button onClick={() => setOpened(true)} color="blue">
        Создать задачу
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Создать новую задачу">
        <TextInput
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.currentTarget.value)}
          placeholder="Введите название задачи"
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
        <Button onClick={handleCreateTask} mt="md">
          Создать задачу
        </Button>
      </Modal>
    </>
  );
};

export default CreateTask;
