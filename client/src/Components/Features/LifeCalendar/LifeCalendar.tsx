import { useState, useEffect } from 'react';
import { Calendar } from '@mantine/dates';
import { Container, Select, Group, Title, ScrollArea } from '@mantine/core';
import { EventItem } from '@/Components';
import dayjs from 'dayjs';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  tag: string;
}

const LifeCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Получаем события с сервера при загрузке компонента
    fetch(`/api/users/1/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // Фильтрация событий по тегам и дате
  const filteredEvents = events.filter((event) => {
    if (filter !== 'all' && event.tag !== filter) return false;
    if (selectedDate) {
      const eventDate = dayjs(event.eventDate, 'DD-MM-YYYY');
      return eventDate.isSame(dayjs(selectedDate), 'day');
    }
    return true;
  });

  return (
    <Container>
      <Title order={2}>Календарь жизни</Title>
      <Group position="apart" mt="md">
        <Calendar value={selectedDate} onChange={setSelectedDate} />
        <Select
          placeholder="Фильтр по тегу"
          data={[
            { value: 'all', label: 'Все' },
            { value: 'important', label: 'Важные' },
            { value: 'upcoming', label: 'Предстоящие' },
            { value: 'past', label: 'Прошедшие' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value || 'all')}
        />
      </Group>
      <ScrollArea style={{ maxHeight: 300 }} mt="md">
        {filteredEvents.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </ScrollArea>
    </Container>
  );
};

export default LifeCalendar;
