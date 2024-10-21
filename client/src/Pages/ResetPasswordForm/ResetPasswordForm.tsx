import React, { useState } from 'react';
import { TextInput, Button, Text, rem, Title } from '@mantine/core';
import { useAuth } from '@/Store'; 
import './resetPass.scss';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { Paths } from '@/Components/App/Routing';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    if (token) {
      try {
        await resetPassword(token, password);
        notifications.show({
          icon: (
            <IconCheck
              style={{ width: rem(18), height: rem(18), color: 'green' }}
            />
          ),
          title: 'Пвроль сброшен',
          message: 'Ваш пароль успешно сброшен',
          loading: false,
          withCloseButton: true,
          color: 'teal',
        });
        setTimeout(() => {
          navigate(Paths.Login);
        }, 2000);
      } catch (error) {
        setMessage('Произошла ошибка при сбросе пароля');
      }
    } else {
      setMessage('Токен не найден в URL');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className='pass-reset'>
      <Title pb={20}>Сброс пароля</Title>
      <TextInput
        type='password'
        placeholder='Новый пароль'
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
      />
      <TextInput
        type='password'
        placeholder='Подтвердите пароль'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
        required
      />
      <Button type='submit'>Сбросить пароль</Button>
      {message && <Text>{message}</Text>}
    </form>
  );
};

export default ResetPassword;
