//@ts-nocheck
import { Card, Text, Button } from "@mantine/core";
import { useTaskStore } from "@Store/TaskStore";

const CompletedTaskItem = ({ task }) => {
  const { updateTask } = useTaskStore();

  const handleRestore = async (event) => {
    event.stopPropagation();
    await updateTask(task.id, { ...task, is_completed: false });
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      style={{
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Text>{task.title}</Text>
        <Text color="green">Завершено</Text>
      </div>
      <div>
        <Button color="green" onClick={handleRestore} size="xs">
          Возобновить
        </Button>
      </div>
    </Card>
  );
};

export default CompletedTaskItem;
