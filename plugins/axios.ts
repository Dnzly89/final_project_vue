import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: config.public.apiBase, 
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });

  return {
    provide: {
      axios: instance
    }
  };
});
