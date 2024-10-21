import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconGauge, IconUser, IconShield } from '@tabler/icons-react';
import classes from './Features.module.scss';
import { Paths } from '@/Components/App/Routing';
import { Link } from 'react-router-dom';

const mockdata = [
  {
    title: 'Производительный',
    description:
      'Сервис написан на современном стеке технологий, благодаря чему имеет хорошую производительность',
    icon: IconGauge,
  },
  {
    title: 'Удобство пользователей',
    description:
      'Мы постарались создать удобный, интуитивно понятный пользовательский интерфейс',
    icon: IconUser,
  },
  {
    title: 'Безопасность',
    description:
      'Мы позаботимся о безопасности ваших данных. Несмотря на открытое API, сервис соответствует нормам безопасности.',
    icon: IconShield,
  },
];

const Features = () => {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow='md'
      radius='md'
      className={classes.card}
      padding='xl'
    >
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz='lg' fw={500} className={classes.cardTitle} mt='md'>
        {feature.title}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size='lg' py='xl' pt={100}>
      <Group justify='center'>
        <Badge variant='filled' size='lg'>
          Особенности сервиса
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta='center' mt='sm'>
      Простая интеграция с любым стеком технологий
      </Title>

      <Text c='dimmed' className={classes.description} ta='center' mt='md'>
        Сервис имеет открытое {" "}
        <Link to={Paths.Documentation} target='blank'>API</Link>. Благодаря этому, вы можете легко интегрировать его в вашу организацию
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl' mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}

export default Features;