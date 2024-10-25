//@ts-nocheck
import { Card, Text, Button } from '@mantine/core';

const EventItem = ({ event }) => {
  return (
    <Card shadow="sm" padding="lg">
      <Text>{event.title}</Text>
      <Text>{event.date}</Text>
      <Text>{event.description}</Text>
    </Card>
  );
};

export default EventItem;
