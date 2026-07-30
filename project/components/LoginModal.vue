<template>
  <div v-if="ui.loginModalOpen" class="overlay" @click.self="close">
    <div class="modal">

      <button class="close-btn" @click="close">×</button>

      <!-- =============================== -->
      <!-- 🔥 ЭКРАН УСПЕШНОЙ РЕГИСТРАЦИИ 🔥 -->
      <!-- =============================== -->
      <template v-if="registrationSuccess">
        <div class="success-screen">
          <img src="/icons/login.svg" class="modal-logo" />

          <h2 class="title">Регистрация завершена</h2>

          <p style="text-align:center; margin-top:10px; margin-bottom:20px;">
            Используйте вашу электронную почту для входа
          </p>

          <button class="submit" @click="switchToLogin">
            Войти
          </button>
        </div>
      </template>

      <!-- =============================== -->
      <!-- 🔵 ФОРМА ВХОДА                 -->
      <!-- =============================== -->
      <template v-else-if="!isRegisterMode">

        <img src="/icons/login.svg" class="modal-logo" />

        <div class="input-wrapper" :class="{ error: loginErrors.email }">
          <img src="/icons/email.svg" class="icon" :class="{ error: loginErrors.email }" />
          <input
            name="login-email"
            type="email"
            placeholder="Электронная почта"
            v-model="loginEmail"
          />
        </div>

        <div class="input-wrapper" :class="{ error: loginErrors.password }">
          <img src="/icons/password.svg" class="icon" :class="{ error: loginErrors.password }" />
          <input
            name="login-password"
            type="password"
            placeholder="Пароль"
            v-model="loginPassword"
          />
        </div>

        <button class="submit" @click="submitLogin">
          Войти
        </button>

        <p class="switch" @click="isRegisterMode = true">Регистрация</p>

      </template>

      <!-- =============================== -->
      <!-- 🟣 ФОРМА РЕГИСТРАЦИИ           -->
      <!-- =============================== -->
      <template v-else>
        
        <h2 class="title">Регистрация</h2>

        <div class="input-wrapper" :class="{ error: errors.email }">
          <img src="/icons/email.svg" class="icon" :class="{ error: errors.email }" />
          <input name="reg-email" type="email" placeholder="Электронная почта" v-model="email" />
        </div>

        <div class="input-wrapper" :class="{ error: errors.firstName }">
          <img src="/icons/user.svg" class="icon" :class="{ error: errors.firstName }" />
          <input name="reg-first-name" type="text" placeholder="Имя" v-model="firstName" />
        </div>

        <div class="input-wrapper" :class="{ error: errors.lastName }">
          <img src="/icons/user.svg" class="icon" :class="{ error: errors.lastName }" />
          <input name="reg-last-name" type="text" placeholder="Фамилия" v-model="lastName" />
        </div>

        <div class="input-wrapper" :class="{ error: errors.password }">
          <img src="/icons/password.svg" class="icon" :class="{ error: errors.password }" />
          <input name="reg-password" type="password" placeholder="Пароль" v-model="password" />
        </div>

        <div class="input-wrapper" :class="{ error: errors.confirmPassword }">
          <img src="/icons/password.svg" class="icon" :class="{ error: errors.confirmPassword }" />
          <input
            name="reg-password-confirm"
            type="password"
            placeholder="Подтвердите пароль"
            v-model="confirmPassword"
          />
        </div>

        <button class="submit" @click="submitRegister">
          Создать аккаунт
        </button>

        <p class="switch" @click="isRegisterMode = false">У меня есть пароль</p>

      </template>

    </div>
  </div>

</template>


<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth.store";

/* const emit = defineEmits<{ (e: "close"): void }>();
const close = () => emit("close"); */

import { useUIStore } from "~/stores/ui.store";
const ui = useUIStore();

const close = () => ui.closeLoginModal();

const auth = useAuthStore();

const isRegisterMode = ref(false);
const registrationSuccess = ref(false);

// поля
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const password = ref("");
const confirmPassword = ref("");

const loginEmail = ref("");
const loginPassword = ref("");

// ошибки
const errors = ref({
  email: false,
  firstName: false,
  lastName: false,
  password: false,
  confirmPassword: false
});

const loginErrors = ref({
  email: false,
  password: false
});

// валидация email
const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// LOGIN
const submitLogin = async (): Promise<void> => {
  loginErrors.value.email = !isValidEmail(loginEmail.value);
  loginErrors.value.password = loginPassword.value.trim() === "";

  if (loginErrors.value.email || loginErrors.value.password) return;

  try {
    await auth.login(loginEmail.value, loginPassword.value);
    close();
  } catch {
    loginErrors.value.email = true;
    loginErrors.value.password = true;
  }
};

// REGISTER
const submitRegister = async (): Promise<void> => {
  errors.value.email = !isValidEmail(email.value);
  errors.value.firstName = firstName.value.trim() === "";
  errors.value.lastName = lastName.value.trim() === "";
  errors.value.password = password.value.trim() === "";
  errors.value.confirmPassword =
    confirmPassword.value !== password.value;

  if (Object.values(errors.value).includes(true)) return;

  try {
    await auth.register(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    );

    // вот что меняем — показываем экран успеха вместо закрытия
    registrationSuccess.value = true;

  } catch (e: any) {
    if (e?.response?.status === 409) {
      errors.value.email = true;
    }
  }
};

// Переключение со "успеха регистрации" на "вход"
const switchToLogin = () => {
  registrationSuccess.value = false;
  isRegisterMode.value = false;
};
</script>






<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;     /* вертикальное центрирование */
  justify-content: center; /* горизонтальное центрирование */

  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
}

/* красная рамка */
.input-wrapper.error input {
  border-color: #ff3b30;
}

/* красная иконка */
.input-wrapper.error .icon {
  filter: brightness(0) saturate(100%) invert(29%) sepia(83%) saturate(4930%) hue-rotate(353deg) brightness(95%) contrast(101%);
}


.modal {
  width: 420px;
  padding: 64px 40px;
  background: white;
  border-radius: 20px;
  position: relative;
}

.modal-logo {
  display: block;
  margin: 0 auto 24px auto; /* центрируем и даём отступ снизу */
  width: 120px;             /* можешь изменить до нужного размера */
  height: auto;
}

.title  {
    text-align: center;
}


.success-screen {
  text-align: center;

}

.success-title {
  font-size: 24px;
  font-weight: 700;
  margin-top: 10px;
}

.success-text {
  font-size: 18px;
  opacity: 0.7;
  margin-top: 10px;
  margin-bottom: 20px;
}

.close-btn {
  position: absolute;
  top: 0;     /* вынесли выше модалки */
  right: -48px;   /* вынесли правее модалки */
  
  width: 40px;
  height: 40px;
  padding: 12px;  
  
  border-radius: 50%;
  background: #ffffff;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;
  line-height: 1;

  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: background .2s;
}

.close-btn:hover {
  background: #f2f2f2;
}


input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 340px;     
  margin: 0 auto;       
}

.input-wrapper input {
  width: 100%;
  max-width: 340px;     
  padding: 14px 16px 14px 48px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box; /* обязательно! */
}

.input-wrapper input:focus {
  border-color: #7aa9f7;
}

.icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  opacity: 0.6;
}


.submit {
  width: 100%;
  max-width: 340px;   /* ограничиваем ширину */
  margin: 20px auto 0 auto; /* центрируем */
  
  padding: 14px 0;
  background: #7aa9f7;
  border: none;
  border-radius: 28px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: block;     /* чтобы margin auto работал */
  transition: background .2s;
}

.submit:hover {
  background: #6b97e0;
}


.reg-link {
  margin-top: 12px;
  display: block;
  text-align: center;
  cursor: pointer;
}
.switch {
  text-align: center;
  font-weight: 700;
  margin-top: 16px;
  cursor: pointer;
  user-select: none;
}

.switch:hover {
  opacity: 0.8;
}


:deep(*) {
  font-family: "Play", sans-serif;
}
</style>
