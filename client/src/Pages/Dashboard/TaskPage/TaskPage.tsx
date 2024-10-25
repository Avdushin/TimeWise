//@ts-nocheck
import { useEffect, useState } from "react";
import { useTaskStore } from "@/Store/TaskStore";
import { LoadingOverlay, Title, Stack } from "@mantine/core";
import TaskItem from "@Components/Features/Tasks/TaskItem";
import CompletedTaskItem from "@Components/Features/Tasks/CompletedTaskItem"; // Новый компонент для завершенных задач
import CreateTask from "@/Components/Features/Tasks/CreateTask";

const TaskPage = () => {
  const { tasks, completedTasks, fetchTasks, loading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <Title order={2}>Мои задачи</Title>
      <CreateTask />

      {loading && <LoadingOverlay visible={loading} />}

      <Title order={3}>Активные задачи</Title>
      <Stack>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Stack>

      <Title order={3}>Выполненные задачи</Title>
      <Stack>
        {completedTasks.map((task) => (
          <CompletedTaskItem key={task.id} task={task} />
        ))}
      </Stack>
    </div>
  );
};

export default TaskPage;
