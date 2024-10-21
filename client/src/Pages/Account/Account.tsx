import { useState, useEffect, FC } from 'react';
import {
  Title,
  Button,
  Stack,
  Text,
  Flex,
  Divider,
  LoadingOverlay,
  Box,
  Anchor,
} from '@mantine/core';
import EditingProfile from './Form/EditingProfile';
import { useAuth } from '@/Store';

const Account: FC = () => {
  // const [userData, setUserData] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  //@ts-ignore
  const [message, setMessage] = useState('');
  const userID = useAuth((state) => state.user.id);
  const getUserData = useAuth((state) => state.getAlluserData);
  const user = useAuth((state) => state.user);

  useEffect(() => {
    getUserData(userID);
    // console.log(user)
    // console.log(userID)
  }, []);

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleViewProfile = () => {
    setEditing(false);
  };

  return (
    <>
      {user ? (
        editing ? (
          <EditingProfile
            user={user}
            onCancel={handleViewProfile}
            message={message}
          />
        ) : (
          <Stack>
            <Title pt={20}>Личный кабинет</Title>
            <Title order={3} pt={20}>
              Аутентификационные данные
            </Title>
            <Divider mt={5} mb={2} />
            <Stack gap={5} pt={10} pb={10}>
              <Flex gap={2}>
                <Text>Имя пользователя:</Text>
                <Text c='dimmed'>{user.auth?.username}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>EMail:</Text>
                <Text c='dimmed'>{user.auth?.email}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Телефон:</Text>
                <Text c='dimmed'>{user.personal?.phone}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Роль:</Text>
                <Text c='dimmed'>{user.auth?.role}</Text>
              </Flex>
            </Stack>

            <Title order={3} pt={5}>
              Персональные данные
            </Title>
            <Divider mt={5} mb={2} />
            <Stack gap={5} pt={10} pb={10}>
              <Flex gap={5}>
                <Text>Имя:</Text>
                <Text c='dimmed'>{user.personal?.name}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Фамилия:</Text>
                <Text c='dimmed'>{user.personal?.surname}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Отчество:</Text>
                <Text c='dimmed'>{user.personal?.patronymic}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Дата рождения:</Text>
                <Text c='dimmed'>
                  {/* TODO Format by dd.mm.yyy */}
                  {user.personal?.birthday}
                </Text>
              </Flex>
            </Stack>

            <Title order={3} pt={20}>
              Рабочие данные
            </Title>
            <Divider mt={5} mb={2} />
            <Stack gap={5} pt={10} pb={10}>
              <Flex gap={5}>
                <Text>Должность:</Text>
                <Text c='dimmed'>{user?.section?.name}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Страна:</Text>
                <Text c='dimmed'>{user.location?.country}</Text>
              </Flex>
              <Flex gap={5}>
                <Text>Город:</Text>
                <Text c='dimmed'>{user.location?.city}</Text>
              </Flex>
              <Title order={3} pt={20}>
              Тестирования
            </Title>
            <Divider mt={5} mb={20} />
              <Flex gap={5}>
                <Text fw="bold">MBTI тип:</Text>
                <Text c='dimmed'>{user.mbti?.type}</Text>
              </Flex>
              <Box>
                <Text fw='bold'>Тестирование Струпа:</Text>
                <Text c='#cfcfcfcf'>Тест №{user.stroop?.id}</Text>
                <Text c='#cfcfcfcf'>Кол-во правильных ответов: {user.stroop?.correct}</Text>
                <Text c='#cfcfcfcf'>Кол-во неправильных ответов: {user.stroop?.incorrect}</Text>
              </Box>
              <Anchor href={`dashboard/users/${userID}`}>Публичный профиль</Anchor>
            </Stack>
            <Button mt={20} onClick={handleEditProfile} mb={{sm: 60, base: 120}}>
              Редактировать профиль
            </Button>
          </Stack>
        )
      ) : (
        // <p>Загрузка данных...</p>
        <LoadingOverlay
          visible={true}
          zIndex={10000}
          overlayProps={{ radius: 'lg', blur: 20 }}
        />
      )}
    </>
  );
};

export default Account;
