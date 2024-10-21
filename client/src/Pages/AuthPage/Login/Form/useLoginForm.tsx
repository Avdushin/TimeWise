import { useState } from 'react';
import { useForm } from '@mantine/form';
import { PathsDashboard } from '@Components/App/Routing';
import { APP_MODE } from '@/Share/Variables';
import { IconCheck } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/Store';
import { DevMode, LoginFormValues } from '@/Utils';

export const useLoginForm = () => {
  //@ts-ignore
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const setLogin = useAuth((state) => state.login);
  const error = useAuth((state) => state.error);

  const form = useForm<LoginFormValues>({
    initialValues: {
      Auth: {
        email: '',
        password: '',
      },
    },

    validate: (values) => {
      if (active === 0) {
        return {
          'Auth.email':
            values.Auth.email.trim().length === 0 ? 'Введите Email' : null,
          'Auth.password':
            values.Auth.password.length === 0 ? 'Введите пароль' : null,
        };
      }

      return {};
    },
  });

  const submitForm = async ({ Auth }: LoginFormValues) => {
    const user = await setLogin({ Auth });
    if (user && !error && APP_MODE !== 'dev') {
      notifications.show({
        icon: (
          <IconCheck
            style={{ width: rem(18), height: rem(18), color: 'green' }}
          />
        ),
        title: 'Успешный вход',
        message:
          'Вы будете перенаправлены на вашу личную страницу через пару секунд',
        loading: false,
        withCloseButton: true,
        color: 'teal',
      });
      navigate(PathsDashboard.Main);
    } else if (user && !error && DevMode) {
      console.log(Auth.email, Auth.password);
      user;
      return;
    } else {
      notifications.show({
        title: 'Ошибка',
        message: 'Неверные учетные данные! 🤔',
        color: 'red',
      });
    }
  };

  return {
    active,
    form,
    submitForm,
  };
};
