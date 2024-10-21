import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { Paths } from "@Components/App/Routing";
import { notifications } from "@mantine/notifications";
import { API } from "@/Components/App/Routing/types/API";
import { useNavigate } from "react-router-dom";
import { $host } from "@/Services/instance";
import { AxiosError } from 'axios';
import { initialValues } from "./initialValues";

export const useSignupForm = () => {
  const [active, setActive] = useState(0);
  const [birthval, setBirthval] = useState<Date | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess) {
      navigate(Paths.Login);
    }
  }, [registrationSuccess]);

  const form = useForm({
    initialValues,
    validate: (values) => {
      if (active === 0) {
        return {
          username: values.username.trim().length < 3 ? "Имя пользователя должно содержать не менее 3 символов." : null,
          email: !/^\S+@\S+\.\S+$/.test(values.email) ? "Некорректный формат email" : null,
          password: values.password.length < 6 ? "Пароль должен содержать не менее 6 символов" : null,
        };
      }
      return {};
    },
  });

  const nextStep = () => setActive((current) => (form.validate().hasErrors ? current : current + 1));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const submitForm = async () => {
    const registrationData = {
      username: form.values.username,
      email: form.values.email,
      password: form.values.password,
      birthdate: form.values.birthdate,
      first_name: form.values.first_name,
      last_name: form.values.last_name,
      middle_name: form.values.middle_name,
      country: form.values.country,
      city: form.values.city,
      phone: form.values.phone,
    };
  
    try {
      const response = await $host.post(API.SignUP, registrationData);
  
      if (response.status === 409) {
        notifications.show({
          title: "Ошибка",
          message: "Такой Email уже существует! 🤥",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Успешная регистрация",
          message: "Перенаправляем на страницу входа...",
          color: "teal",
        });
        setRegistrationSuccess(true);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        notifications.show({
          title: "Ошибка",
          message: error.response.data.message || "Ошибка отправки формы",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Ошибка сети",
          message: "Не удалось подключиться к серверу. Попробуйте позже.",
          color: "red",
        });
      }
    }
  };
  

  return {
    active,
    birthval,
    setBirthval,
    registrationSuccess,
    form,
    nextStep,
    prevStep,
    submitForm,
  };
};
