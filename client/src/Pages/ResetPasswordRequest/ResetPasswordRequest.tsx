//@ts-nocheck
import { FC, FormEvent, useState } from 'react';
import { TextInput, Button, Flex, Title, rem } from '@mantine/core';
import { useAuth } from '@/Store';
import { Header } from '@/Components/Features/Layouts';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@/Components/App/Routing';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const ResetPasswordRequest: FC = () => {
  const [values, setValues] = useState({ email: '' });
  const { forgotPassword } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const Navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handlePasswordReset = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await forgotPassword(values.email);
      // setSuccessMessage('Ссылка для сброса пароля успешно отправлена!');
      notifications.show({
        icon: (
          <IconCheck
            style={{ width: rem(18), height: rem(18), color: 'green' }}
          />
        ),
        title: 'Запрос на сброс пароля',
        message: 'Запрос на сброс пароля успешно отправлен',
        loading: false,
        withCloseButton: true,
        color: 'teal',
      });
      setTimeout(() => {
        Navigate(Paths.Login);
      }, 2000);
    } catch (error) {
      console.error('Error sending password reset link:', error);
      setErrorMessage('Error sending password reset link');
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
          paddingBottom: '120px',
        }}
      >
        <Title order={1} pb={20}>
          Восстановить пароль
        </Title>
        <form onSubmit={handlePasswordReset}>
          <Flex justify='center' direction='column' gap='md'>
            <TextInput
              type='email'
              name='email'
              value={values.email}
              onChange={handleChange}
              placeholder='Введите ваш email'
              required
            />
            <Button type='submit'>Восстановить пароль</Button>
            {successMessage && <div>{successMessage}</div>}
            {errorMessage && <div>{errorMessage}</div>}
          </Flex>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordRequest;
