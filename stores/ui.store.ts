import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    loginModalOpen: false,
  }),

  actions: {
    openLoginModal() {
      this.loginModalOpen = true;
    },
    closeLoginModal() {
      this.loginModalOpen = false;
    }
  }
});
