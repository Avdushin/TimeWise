//@ts-nocheck
import { $authHost, $host } from '@/Services/instance/index';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { jwtDecode } from 'jwt-decode';
import { AxiosError, isAxiosError } from 'axios';
import {
  SignupFormValues,
  LoginFormValues,
  UserData as User,
  UserData,
  dev,
} from '@/Utils';
import { type AuthErrorType } from '@/Utils/types/Errors/Auth/Errors';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@/Components/App/Routing';

export interface IAuthStore {
  isAuth: boolean;
  user: User;
  error: string;
  loading: boolean;
  register: (data: SignupFormValues) => Promise<User | undefined>;
  login: (data: LoginFormValues) => Promise<User | undefined>;
  getAlluserData: (id: number) => Promise<User | undefined>;
  updateUserData: (id: number, newData: UserData | null) => Promise<User | void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  loguot: () => void;
  chaekAuth: () => Promise<User | undefined>;
}

export const useAuth = create<IAuthStore>()(immer(devtools((set, get) => ({
  isAuth: false,
  user: {} as User, // Инициализация пользователя как пустого объекта
  error: '',
  loading: false,

  register: async ({ Auth, Personal, Location, position }) => {
    try {
      set({ loading: true });
      const { data } = await $host.post('api/signup', {
        Auth,
        Personal,
        Location,
        position,
      });
      localStorage.setItem('token', data.token);
      const user = jwtDecode<User>(data.token);
      set({ user: user });
      return user;
    } catch (error) {
      if (isAxiosError(error)) {
        const err: AxiosError<AuthErrorType> = error;
        set({ error: err.response?.data.message });
      }
    } finally {
      set({ loading: false });
      setTimeout(() => set({ error: '' }), 5000);
    }
  },

  login: async ({ Auth }) => {
    try {
      set({ loading: true });
      const { data } = await $host.post('api/login', {
        Auth,
      });
      localStorage.setItem('token', data.token);
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
      setTimeout(() => set({ error: '' }), 5000);
    }
  },

  getAlluserData: async (id: number) => {
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

  updateUserData: async (userId: number, newData: UserData | null) => {
    try {
      const response = await $host.put(`api/users/update/${userId}`, newData);
      const updatedUserData = response.data; // Получаем обновленные данные пользователя
      set({ user: updatedUserData }); // Обновление данных пользователя в сторе
      localStorage.setItem('token', response.data.token);
      return updatedUserData;
    } catch (error) {
      throw error;
    }
  },

  chaekAuth: async () => {
    set({ loading: true });
    try {
      const { data } = await $authHost.get('api/user/auth');
      localStorage.setItem('token', data.token);
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
      setTimeout(() => set({ error: '' }), 1000);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      set({ loading: true });
      await $host.post('api/forgot-password', { email });
    } catch (error) {
      console.error('Error sending password reset link:', error);
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      set({ loading: true });
      await $host.post('api/reset-password', { token, newPassword });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Error resetting password');
    } finally {
      set({ loading: false });
    }
  },

  loguot: async () => {
    set({ loading: true });
    try {
      localStorage.removeItem('token');
      set({ user: {} as User, isAuth: false });
      setTimeout(() => window.location.reload(), 1200);
    } catch (error) {
      if (isAxiosError(error)) {
        const err: AxiosError<AuthErrorType> = error;
        set({ error: err.response?.data.message });
      }
    } finally {
      set({ loading: false });
    }
  },
}))));
