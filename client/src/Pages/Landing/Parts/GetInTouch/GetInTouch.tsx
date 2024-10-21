//@ts-nocheck
import { $host } from "@/Services/instance";
import { dev } from "@/Utils";
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Button,
  Paper,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export const GetInTouch = () => {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Имя должно содержать не менее 2 символов" : null,
      email: (value) =>
        !/^\S+@\S+$/.test(value) ? "Неверный формат email" : null,
      subject: (value) =>
        value.trim().length === 0 ? "Заполните тему сообщения" : null,
    },
  });
  //@ts-ignore
  const handleSubmit = async (values) => {
    try {
      const url =  import.meta.env.VITE_APP_API_URL
      const response = await $host.post("/api/send-message", values);
      dev.log(response.data);
      setOpened(true);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Paper
      shadow="xs"
      p="xl"
      radius="lg"
      style={{ boxShadow: "0px 0px 25px 1px #3B3B3B" }}
      id="get_in_touch"
    >
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        title="Форма отправлена"
      >
      Ваше обращение успешно отправлено!      
      </Modal>
  
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
          fw={900}
          ta="center"
        >
          Связаться
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="Имя"
            placeholder="Ваше имя"
            name="name"
            variant="filled"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="Ваш email"
            name="email"
            variant="filled"
            {...form.getInputProps("email")}
          />
        </SimpleGrid>

        <TextInput
          label="Тема"
          placeholder="Тема сообщения"
          mt="md"
          name="subject"
          variant="filled"
          {...form.getInputProps("subject")}
        />
        <Textarea
          mt="md"
          label="Сообщение"
          placeholder="Ваше сообщение"
          maxRows={10}
          minRows={5}
          autosize
          name="message"
          variant="filled"
          {...form.getInputProps("message")}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Отправить
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default GetInTouch;
