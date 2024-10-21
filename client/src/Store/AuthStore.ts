//@ts-nocheck
import { $authHost, $host } from "@/Services/instance/index";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { jwtDecode } from "jwt-decode";
import { AxiosError, isAxiosError } from "axios";
import {
  SignupFormValues,
  LoginFormValues,
  UserData as User,
  UserData,
  dev,
} from "@/Utils";
import { type AuthErrorType } from "@/Utils/types/Errors/Auth/Errors";

// Обновлённые интерфейсы
export interface IAuthStore {
  isAuth: boolean;
  user: User;
  error: string;
  loading: boolean;
  register: (formData: SignupFormValues) => Promise<User | undefined>;
  login: (formData: LoginFormValues) => Promise<User | undefined>;
  getAlluserData: (id: string) => Promise<UserData | undefined>;
  updateUserData: (
    id: string,
    newData: UserData | null
  ) => Promise<User | void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<User | undefined>;
}

export const useAuth = create<IAuthStore>()(
  immer(
    devtools((set, get) => ({
      isAuth: false,
      user: {} as User,
      error: "",
      loading: false,

      // Регистрация
      register: async ({ Auth, Personal, Location, position }) => {
        try {
          set({ loading: true });
          const { data } = await $host.post("api/signup", {
            username: Auth.username,
            email: Auth.email,
            password: Auth.password,
            birthdate: Personal.birthday,
            first_name: Personal.name,
            last_name: Personal.surname,
            middle_name: Personal.patronymic,
            country: Location.country,
            city: Location.city,
            phone: Personal.phone,
            position,
          });
          localStorage.setItem("token", data.token);
          const user = jwtDecode<User>(data.token);
          set({ user, isAuth: true });
          return user;
        } catch (error) {
          if (isAxiosError(error)) {
            const err: AxiosError<AuthErrorType> = error;
            set({ error: err.response?.data.message });
          }
        } finally {
          set({ loading: false });
          setTimeout(() => set({ error: "" }), 5000);
        }
      },

      // Логин
      login: async ({ Auth }) => {
        try {
          set({ loading: true });
          const { data } = await $host.post("api/login", {
            email: Auth.email,
            password: Auth.password,
          });
          localStorage.setItem("token", data.token);
          console.log(data.token);

          const user = jwtDecode<User>(data.token);
          set({ user, isAuth: true });
          return user;
        } catch (error) {
          if (isAxiosError(error)) {
            const err: AxiosError<AuthErrorType> = error;
            set({ error: err.response?.data.message });
          }
        } finally {
          set({ loading: false, isAuth: true });
          setTimeout(() => set({ error: "" }), 5000);
        }
      },

      // Получение данных пользователя
      getAlluserData: async (id: string) => {
        try {
          const { data } = await $host.get(`api/users/${id}`);
          set({ user: data });
          return data;
        } catch (error) {
          if (isAxiosError(error)) {
            const err: AxiosError<AuthErrorType> = error;
            set({ error: err.response?.data.message });
          }
        }
      },

      // Обновление данных пользователя
      updateUserData: async (id: string, newData: UserData | null) => {
        try {
          const { data } = await $host.put(`api/users/update/${id}`, newData);
          localStorage.setItem("token", data.token);
          const updatedUserData = jwtDecode<User>(data.token);
          set({ user: updatedUserData });
          return updatedUserData;
        } catch (error) {
          throw error;
        }
      },

      checkAuth: async () => {
        set({ loading: true });
        const token = localStorage.getItem("token");
        console.log(`token = ${token}`);
        
    
        try {
            const { data } = await $authHost.get("api/user/auth", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Сохраняем JWT токен, а не его расшифрованные данные
            localStorage.setItem("token", data.token);
    
            // Декодируем токен только для извлечения информации о пользователе
            const user = jwtDecode<User>(data.token);
            set({ user: user, isAuth: true });
            return user;
        } catch (error) {
            if (isAxiosError(error)) {
                const err: AxiosError<AuthErrorType> = error;
                set({ error: err.response?.data.message });
            }
        } finally {
            set({ loading: false });
        }
    },       

      // Восстановление пароля
      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          await $host.post("api/forgot-password", { email });
        } catch (error) {
          console.error("Error sending password reset link:", error);
        } finally {
          set({ loading: false });
        }
      },

      // Сброс пароля
      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          await $host.post("api/reset-password", { token, newPassword });
        } catch (error) {
          set({ loading: false });
          console.error("Error resetting password:", error);
        }
      },

      // Логаут
      logout: async () => {
        try {
          localStorage.removeItem("token");
          set({ user: {} as User, isAuth: false });
        } catch (error) {
          if (isAxiosError(error)) {
            const err: AxiosError<AuthErrorType> = error;
            set({ error: err.response?.data.message });
          }
        }
      },
    }))
  )
);
