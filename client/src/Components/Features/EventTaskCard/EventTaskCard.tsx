import { Card, Text, Badge, Group } from '@mantine/core';

interface EventCardProps {
  event: {
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    tags: string[];
  };
}

interface TaskCardProps {
  task: {
    title: string;
    dueDate: string;
    isCompleted: boolean;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <Card shadow="sm" p="lg" mt="md">
    <Text fw={500}>{event.title}</Text>
    <Text color="dimmed" size="sm">
      {event.description}
    </Text>
    <Group gap="xs" mt="xs">
      {event.tags.map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
    </Group>
    <Text size="xs" c="dimmed" mt="xs">
      {event.eventDate} {event.eventTime}
    </Text>
  </Card>
);

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
  <Card shadow="sm" p="lg" mt="md">
    <Text fw={500}>{task.title}</Text>
    <Text c="dimmed" size="xs">
      {task.dueDate}
    </Text>
  </Card>
);
