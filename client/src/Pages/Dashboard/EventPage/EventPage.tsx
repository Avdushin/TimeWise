//@ts-nocheck
import { useEffect } from 'react';
import { useTaskStore } from '@Store/TaskStore';
import { LoadingOverlay, Title, Stack } from '@mantine/core';
import EventItem from '@Components/Features/Events/EventItem';

const EventPage = () => {
  const { events, fetchEvents, loading } = useTaskStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div>
      <Title order={2}>Мои события</Title>

      {loading && <LoadingOverlay visible={loading} overlayBlur={2} />}

      <Stack>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </Stack>
    </div>
  );
};

export default EventPage;
