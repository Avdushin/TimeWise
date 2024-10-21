import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';

const Example = () => {
  const [loading] = useDisclosure();
  return (
    <Stack>
      <Title order={1}>Heading 1</Title>
      <Title order={2}>Heading 2</Title>
      <Title order={3}>Heading 3</Title>
      <Title order={4}>Heading 4</Title>
      <Title order={5}>Heading 5</Title>
      <Title order={6}>Heading 6</Title>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>

      <Group>
        <Button loading={loading}>Filled button</Button>
        <Button variant='light' loading={loading}>
          Light button
        </Button>
        <Button variant='outline' loading={loading}>
          Outline button
        </Button>
      </Group>
      {/* Alerts */}
      <Alert
        variant='light'
        color='blue'
        title='Alert title'
        icon={<IconInfoCircle />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
      <Alert
        variant='dark'
        color='blue'
        title='Alert title'
        icon={<IconInfoCircle />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
      <Alert
        variant='light'
        color='yellow'
        title='Alert title'
        icon={<IconInfoCircle />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
      <Alert
        variant='light'
        color='red'
        title='Alert title'
        icon={<IconInfoCircle />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
      <Alert
        variant='light'
        color='pink'
        title='Alert title'
        icon={<IconInfoCircle />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis,
        quae tempore necessitatibus placeat saepe.
      </Alert>
    </Stack>
  );
};

export default Example;
