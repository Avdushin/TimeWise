import { FC } from "react";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Code,
  Alert,
  Box,
  Anchor,
  Select,
  Input,
  Text,
  Title,
  Stack,
  Container,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconInfoCircle } from "@tabler/icons-react";
import { APP } from "@/Share/Variables";
import { optionsFilter } from "./utils/select";
import { countryOptions } from "./utils/countryOptions";
import { IMaskInput } from "react-imask";
import { useSignupForm } from "./Form/useSignupForm";
import { Link } from "react-router-dom";
import { Paths } from "@/Components/App/Routing";
import { Header } from "@/Components/Features/Layouts";
import { DevMode } from "@/Utils";

const Signup: FC = () => {
  const { active, birthval, setBirthval, form, nextStep, prevStep, submitForm } =
    useSignupForm();

  //@ Dev success callback
  const DevSuccesSugnUP = () => (
    <>
      <Text>Completed! Form values:</Text>
      <Code block mt="xl">
        {JSON.stringify(form.values, null, 2)}
      </Code>
    </>
  );
  //@ Production success callback
  const SuccesSugnUP = () => (
    <Box>
      <Alert
        variant="light"
        color="orange"
        title="Уведомление"
        icon={<IconInfoCircle />}
      >
        После нажатия на кнопку "Зарегистрироваться" будет создана ваша учетная
        запись внутри сервиса
        <Anchor href="/" target="blank">
          {" "}
          {APP.FULLNAME}
        </Anchor>
      </Alert>
    </Box>
  );

  return (
    <>
      <Header />
      <Container>
        <Stack pt={60} align="center">
          <Title>Регистрация</Title>
        </Stack>
        <Stepper active={active} pt={50}>
          <Stepper.Step label="Регистрация" description="Данные для входа">
            <TextInput
              label="Имя пользователя"
              placeholder="Имя пользователя"
              required={true}
              {...form.getInputProps("username")}
            />
            <TextInput
              label="Email"
              placeholder="Email"
              required={true}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              mt="md"
              label="Пароль"
              placeholder="Пароль"
              required={true}
              {...form.getInputProps("password")}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Личные данные"
            description="Информация о пользователе"
          >
            <TextInput
              label="Имя"
              placeholder="Имя"
              required={true}
              {...form.getInputProps("first_name")}
            />
            <TextInput
              mt="md"
              label="Фамилия"
              placeholder="Фамилия"
              {...form.getInputProps("last_name")}
            />
            <TextInput
              mt="md"
              label="Отчество"
              placeholder="Отчество"
              {...form.getInputProps("middle_name")}
            />
            <DateInput
              mt="md"
              value={birthval}
              onChange={(date) => {
                const formattedDate = date
                  ? date.toISOString().split("T")[0]
                  : "";
                form.setFieldValue("birthdate", formattedDate);
                setBirthval(date);
              }}
              label="Дата рождения"
              placeholder="Дата рождения"
            />
          </Stepper.Step>

          <Stepper.Step
            label="Контактная информация"
            description="Контакты и место жительства"
          >
            <Input
              mt="md"
              label="Телефон"
              placeholder="Телефон"
              component={IMaskInput}
              mask="+7 (000) 000-00-00"
              {...form.getInputProps("phone")}
            />
            <Select
              mt="md"
              label="Страна"
              placeholder="Страна"
              data={countryOptions}
              filter={optionsFilter}
              searchable
              {...form.getInputProps("country")}
            />
            <TextInput
              mt="md"
              label="Город"
              placeholder="Город"
              {...form.getInputProps("city")}
            />
          </Stepper.Step>
          <Stepper.Completed>
            {SuccesSugnUP()}
            {DevMode && DevSuccesSugnUP()}
          </Stepper.Completed>
        </Stepper>
        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Назад
            </Button>
          )}
          {active !== 3 ? (
            <>
              <Text mr={"auto"}>
                Уже есть аккаунт?
                {"  "}
                <Link to={Paths.Login}>Войдите!</Link>
              </Text>
              <Button onClick={nextStep}>Далее</Button>
            </>
          ) : (
            <Button onClick={submitForm}>Зарегистрироваться</Button>
          )}
        </Group>
      </Container>
    </>
  );
};

export default Signup;
