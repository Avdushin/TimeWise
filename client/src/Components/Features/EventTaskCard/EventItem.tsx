import { Card, Text, Badge } from '@mantine/core';

interface EventProps {
  event: {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    tag: string;
  };
}

export const EventItem: React.FC<EventProps> = ({ event }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={500}>{event.title}</Text>
      <Text size="sm" color="dimmed">
        {event.eventDate} - {event.eventTime}
      </Text>
      <Text mt="xs">{event.description}</Text>
      {event.tag && <Badge color="blue" mt="xs">{event.tag}</Badge>}
    </Card>
  );
};
