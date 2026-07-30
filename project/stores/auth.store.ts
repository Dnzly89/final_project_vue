// stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthApi } from "~/api/auth.api";
import type { User } from "~/api/auth.api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuth = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const api = useAuthApi();

  /** Загружаем профиль при запуске */
  const loadProfile = async () => {
    loading.value = true;

    try {
      const profile = await api.profile();

      // Не авторизован
      if (!profile) {
        user.value = null;
        isAuth.value = false;
        error.value = null;
        return;
      }

      // Авторизован
      user.value = profile;
      isAuth.value = true;
      error.value = null;

    } catch (_) {
      // Не выводим ошибку в консоль — никаких console.error
      user.value = null;
      isAuth.value = false;
    } finally {
      loading.value = false;
    }
  };

  /** ЛОГИН */
  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      await api.login({ email, password });
      await loadProfile();
      error.value = null;
    } catch (e: any) {
      
      error.value = e?.response?.data?.message || "Ошибка авторизации";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /** РЕГИСТРАЦИЯ */
const register = async (
  email: string,
  password: string,
  name?: string,
  surname?: string
) => {
  loading.value = true;
  try {
    await api.register({
      email,
      password,
      name,      
      surname,   
    });

    await login(email, password);
    error.value = null;

  } catch (e: any) {
    error.value = e?.response?.data?.message || "Ошибка регистрации";
    throw e;
  } finally {
    loading.value = false;
  }
};



  /** ВЫХОД */
  const logout = async () => {
    loading.value = true;
    try {
      await api.logout();
      user.value = null;
      isAuth.value = false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    isAuth,
    loading,
    error,
    loadProfile,
    login,
    register,
    logout,
  };
});
