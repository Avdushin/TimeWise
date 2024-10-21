import { FC } from 'react';
import {
  Button,
  Group,
  TextInput,
  PasswordInput,
  Text,
  Title,
  Box,
  Container,
} from '@mantine/core';
import { useLoginForm } from './Form/useLoginForm';
import { Paths } from '@Components/App/Routing/types/Paths';
import { Link } from '@/Components/Shared';
import { Header } from '@/Components/Features/Layouts';
import { DevMode } from '@/Utils';

const Login: FC = () => {
  const { form, submitForm } = useLoginForm();

  //@ Dev success callback
  const DevSuccessLogin = () => (
    <Text>Completed! Form values: {JSON.stringify(form.values, null, 2)}</Text>
  );

  const handleLogin = async () => {
    await submitForm({
      Auth: {
        email: form.values.Auth.email,
        password: form.values.Auth.password,
      },
    });
  };

  return (
    <>
      <Header />
      <Container>
        <Box pt={70} w={{ base: '90%', sm: '40%' }} m={'0px auto'}>
          <Title style={{ textAlign: 'center', paddingBottom: '20px' }}>
            Авторизация
          </Title>
          <TextInput
            label='Email'
            placeholder='Email'
            required
            {...form.getInputProps('Auth.email')}
          />
          <PasswordInput
            mt='md'
            label='Пароль'
            placeholder='Пароль'
            required
            {...form.getInputProps('Auth.password')}
          />
          <Text pt={10}>
            Ещё нет аккаунта? {'  '}
            <Link underline={true} to={Paths.Signup}>
              Зарегистрируйтесь!
            </Link>
          </Text>
            <Link underline={true} to={Paths.ForgotPassword}>
              Забыли пароль?
            </Link>
          <Group justify='center' mt='xl'>
            <Button onClick={handleLogin}>Войти</Button>
          </Group>
          {DevMode && DevSuccessLogin()}
        </Box>
      </Container>
    </>
  );
};

export default Login;
