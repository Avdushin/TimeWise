import { useAuth, useMBTIStore } from '@/Store';

const updateMBTIType = async (userId: number, type: string) => {
  const authStore = useAuth.getState();
  // const mbtiStore = useMBTIStore.getState();

  try {
    // Проверяем, аутентифицирован ли пользователь
    if (authStore.isAuth) {
      // Получаем текущего пользователя
      const user = authStore.user;

      // Обновляем поле "Type" в объекте пользователя
      user.mbti.type = type;

      // Обновляем данные пользователя в базе данных с помощью метода из стора авторизации
      await useAuth.getState().updateUserData(userId, user);

      // Обновляем результат в сторе MBTI
      //@ts-ignore
      useMBTIStore.getState().set((state: any) => ({
        ...state,
        result: type,
      }));
    } else {
      throw new Error('User is not authenticated');
    }
  } catch (error) {
    console.error('Failed to update MBTI type:', error);
  }
};

export default updateMBTIType;
