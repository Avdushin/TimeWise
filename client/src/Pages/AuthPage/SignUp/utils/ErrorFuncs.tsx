import { Notification, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export const EmailExist = () => {
  <Notification
    icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
    color='red'
    title='Ошибка!'
  >
    Такой Email уже существует!
  </Notification>;
};
export const FailToSendForm = () => {
  <Notification
    icon={<IconX style={{ width: rem(20), height: rem(20) }} />}
    color='red'
    title='Ошибка!'
  >
    Не удалось отправить форму. Пожалуйста, попробуйте ещё раз...
  </Notification>;
};
