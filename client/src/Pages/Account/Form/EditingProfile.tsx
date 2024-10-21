import { FC, useEffect, useState } from 'react';
import {
  Title,
  Button,
  TextInput,
  Flex,
  Box,
  Divider,
  Stack,
  Select,
} from '@mantine/core';
import { countryOptions } from '@/Pages/AuthPage/SignUp/utils/countryOptions';
import { optionsFilter } from '@/Pages/AuthPage/SignUp/utils/select';
import { IMaskInput } from 'react-imask';
import { UserData, dev } from '@/Utils';
import { useAuth } from '@/Store';
import { Link } from '@/Components/Shared';
import { Paths } from '@Components/App/Routing';
import c from '../Account.module.scss';

interface EditingProfileProps {
  user: UserData;
  onCancel: () => void;
  message: string;
}

const EditingProfile: FC<EditingProfileProps> = ({
  user,
  onCancel,
  message,
}) => {
  const [newUserData, setNewUserData] = useState<UserData>({} as UserData);
  const updateUserData = useAuth((state) => state.updateUserData);

  useEffect(() => {
    setNewUserData(user);
    dev.log('newUserData: ', newUserData);
    dev.log('user: ', user);
    dev.log('userID: ', user.id);
  }, []);

  const handleSave = () => {
    updateUserData(user.id, newUserData);
    window.location.reload();
  };

  return (
    // <Container size='lg' className='Private' pt={40} pb={50}>
      <Stack  pt={40} pb={{base: 160, sm: 120}}>
        <Title order={2}>Личный кабинет</Title>
        <Divider mt={5} mb={2} />
        <Title order={3} pt={0}>
          Аутентификационные данные
        </Title>
        <Divider mb={2} />
        <div className='user-profile profile_container'>
          <form>
            <Flex direction='column' gap='xs'>
              <TextInput
                label='Имя пользователя'
                value={newUserData?.auth?.username}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    auth: { ...prev.auth, username: e.target.value },
                  }))
                }
                max={16}
              />
              <TextInput
                label='Email'
                value={newUserData?.auth?.email}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    auth: { ...prev.auth, email: e.target.value },
                  }))
                }
              />
              <TextInput
                mt='md'
                label='Телефон'
                placeholder='Телефон'
                component={IMaskInput}
                //@ts-ignore
                mask='+7 (000) 000-00-00'
                value={newUserData?.personal?.phone}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    personal: { ...prev.personal, phone: e.target.value },
                  }))
                }
              />
              <Box className='passwords-box'>
                <Link to={Paths.ForgotPassword} className={c.chpass}>
                  Сменить пароль
                </Link>
              </Box>
            </Flex>

            <Title order={3} pt={20}>
              Персональные данные
            </Title>
            <Divider mt={5} pb={20} />
            <Stack>
              <TextInput
                label='Имя'
                value={newUserData?.personal?.name}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value },
                  }))
                }
              />
              <TextInput
                label='Фамилия'
                value={newUserData?.personal?.surname}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    personal: { ...prev.personal, surname: e.target.value },
                  }))
                }
              />
              <TextInput
                label='Отчество'
                value={newUserData?.personal?.patronymic}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    personal: { ...prev.personal, patronymic: e.target.value },
                  }))
                }
              />
              <TextInput
                label='Дата рождения'
                value={newUserData?.personal?.birthday}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    personal: { ...prev.personal, birthday: e.target.value },
                  }))
                }
              />
            </Stack>

            <Title order={3} pt={20}>
              Рабочие данные
            </Title>
            <Divider mt={5} pt={10} />
            <Stack>
              <TextInput
                label='Отдел'
                value={newUserData?.section?.name}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
              />
              <Select
                mt='md'
                label='Страна'
                placeholder='Страна'
                data={countryOptions}
                value={newUserData?.location?.country}
                filter={optionsFilter}
                searchable
                onChange={(selectedOption) => {
                  if (
                    typeof selectedOption === 'string' ||
                    selectedOption === null
                  ) {
                    setNewUserData((prev: any) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        country: selectedOption || '',
                      },
                    }));
                  }
                }}
              />
              <TextInput
                label='Город'
                value={newUserData?.location?.city}
                onChange={(e) =>
                  setNewUserData((prev: any) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))
                }
              />
            </Stack>

            <Flex gap='sm' pt={20}>
              <Button
                color='teal'
                className='save-btn profile-btn btn'
                type='submit'
                onClick={handleSave}
              >
                Сохранить
              </Button>
              <Button
                className='cancel-btn profile-btn btn'
                type='button'
                onClick={onCancel}
              >
                Отмена
              </Button>
            </Flex>
          </form>
          {message && <p className='message'>{message}</p>}
        </div>
      </Stack>
    // </Container>
  );
};

export default EditingProfile;