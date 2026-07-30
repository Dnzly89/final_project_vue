// api/auth.api.ts
import { useNuxtApp } from "#app";

export interface User {
  id: number;
  email: string;
  name?: string;
  surname: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  surname?: string; 
}

export const useAuthApi = () => {
  const { $axios } = useNuxtApp();

  return {
    /** GET /profile — данные текущего пользователя */
    async profile(): Promise<User | null> {
      try {
        const res = await $axios.get("/profile", {
          withCredentials: true,
        });

        if (!res.data || typeof res.data === "string") {
          return null;
        }

        return res.data as User;

      } catch (e: any) {
        if (e?.response?.status === 401) {
          return null;
        }
        throw e;
      }
    },

    /** POST /auth/login */
    login(payload: LoginPayload) {
      return $axios.post("/auth/login", payload, {
        withCredentials: true
      });
    },

    /** POST /user — регистрация */
    register(payload: RegisterPayload) {
      return $axios.post("/user", payload);
    },

    /** GET /auth/logout */
    logout() {
      return $axios.get("/auth/logout", {
        withCredentials: true
      });
    }
  };
};

