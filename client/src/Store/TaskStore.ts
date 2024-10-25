// @ts-nocheck
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { $host } from '@Services/instance';
import { AxiosError } from 'axios';
import { TaskData, EventData } from '@/Utils/types';
import { useAuth } from '@Store/AuthStore';

export interface ITaskStore {
  tasks: TaskData[];
  completedTasks: TaskData[];
  events: EventData[];
  loading: boolean;
  error: string;
  fetchTasks: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  createTask: (newTask: TaskData) => Promise<void>;
  updateTask: (taskId: number, updatedTask: TaskData) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
  restoreTask: (taskId: number) => Promise<void>;
}

export const useTaskStore = create<ITaskStore>()(
  immer(
    devtools((set) => ({
      tasks: [],
      completedTasks: [],
      events: [],
      loading: false,
      error: '',

      fetchTasks: async () => {
        const { user } = useAuth.getState();
        set({ loading: true });
        try {
          const { data } = await $host.get(`/api/users/${user.id}/tasks`);
          // Обновляем списки задач
          set({
            tasks: data.filter(task => !task.is_completed),
            completedTasks: data.filter(task => task.is_completed),
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error fetching tasks' });
          }
        } finally {
          set({ loading: false });
        }
      },

      fetchEvents: async () => {
        set({ loading: true });
        try {
          const { data } = await $host.get('/api/events');
          set({ events: data });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error fetching events' });
          }
        } finally {
          set({ loading: false });
        }
      },

      createTask: async (newTask: TaskData) => {
        const { user } = useAuth.getState();
        if (user.id) {
          const taskWithUserId = { ...newTask, user_id: user.id };
          try {
            const { data } = await $host.post(`/api/users/${user.id}/tasks`, taskWithUserId);
            set((state) => {
              state.tasks.push(data);
            });
          } catch (error) {
            if (error instanceof AxiosError) {
              set({ error: 'Error creating task' });
            }
          }
        } else {
          set({ error: 'User ID is missing' });
        }
      },

      updateTask: async (taskId: number, updatedTask: TaskData) => {
        try {
          const { data } = await $host.put(`/api/tasks/${taskId}`, updatedTask);
          set((state) => {
            const taskIndex = state.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              state.tasks[taskIndex] = data;
            } else {
              const completedTaskIndex = state.completedTasks.findIndex(task => task.id === taskId);
              if (completedTaskIndex !== -1) {
                state.completedTasks[completedTaskIndex] = data;
              }
            }
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error updating task' });
          }
        }
      },

      deleteTask: async (taskId: number) => {
        try {
          await $host.delete(`/api/tasks/${taskId}`);
          set((state) => {
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            state.completedTasks = state.completedTasks.filter(task => task.id !== taskId);
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error deleting task' });
          }
        }
      },

      completeTask: async (taskId: number) => {
        try {
          const { data } = await $host.post(`/api/tasks/complete/${taskId}`);
          set((state) => {
            // Удаляем задачу из активных и переносим её в выполненные
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            state.completedTasks.push(data);
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error completing task' });
          }
        }
      },

      restoreTask: async (taskId: number) => {
        try {
          const { data } = await $host.post(`/api/tasks/recover/${taskId}`);
          set((state) => {
            // Удаляем задачу из выполненных и возвращаем в активные
            state.completedTasks = state.completedTasks.filter(task => task.id !== taskId);
            state.tasks.push(data);
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: 'Error restoring task' });
          }
        }
      },
    }))
  )
);
