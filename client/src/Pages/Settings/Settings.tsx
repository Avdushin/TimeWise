import { ThemeSwithcer } from '@/Components/Features';
import { Stack, Title } from '@mantine/core';
import classes from './settings.module.scss';

const Settings = () => {
  return (
    <div className={classes.settings}>
      <Title>Настройки</Title>
      <Stack>
        <Title order={2} className={classes.settings__title}>
          Настройки темы
        </Title>
        <ThemeSwithcer />
      </Stack>
    </div>
  );
};

export default Settings;
