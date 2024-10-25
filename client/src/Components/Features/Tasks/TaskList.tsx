import CreateTask from "./CreateTask";
import TaskItem from "./TaskItem";
import { useTaskStore } from "@Store/TaskStore";

const TaskList = () => {
  const { tasks } = useTaskStore();

  return (
    <div>
      <CreateTask />
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
