<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import ThemeToggle from '@/components/base/themeToggle/ThemeToggle.vue'
import { useUserStore } from '../stores/user'

const mode = ref<'login' | 'registration'>('login')

const registrationForm = reactive<{ email: string; password: string; name: string }>({
  email: '',
  password: '',
  name: '',
})

const loginForm = reactive<{ email: string; password: string }>({
  email: '',
  password: '',
})

const { loginUser, registerUser } = useUserStore()

const isLoginMode = computed(() => mode.value === 'login')

const onSubmit = () => {
  if (isLoginMode.value) {
    loginUser(loginForm)
    return
  }

  registerUser(registrationForm)
}

const switchMode = () => {
  mode.value = isLoginMode.value ? 'registration' : 'login'
}
</script>

<template>
  <div class="auth">
    <div class="auth__theme">
      <ThemeToggle />
    </div>

    <div class="auth__card">
      <div class="auth__header">
        <span class="auth__logo">TM</span>
        <h1 class="auth__title">
          {{ isLoginMode ? 'Вход в Task Manager' : 'Создание аккаунта' }}
        </h1>
        <p class="auth__subtitle">
          {{
            isLoginMode
              ? 'Управляйте проектами и задачами в одном месте'
              : 'Заполните данные, чтобы начать работу'
          }}
        </p>
      </div>

      <el-form
        v-if="isLoginMode"
        :model="loginForm"
        label-position="top"
        class="auth__form"
        @submit.prevent="onSubmit"
        @keyup.enter="onSubmit"
      >
        <el-form-item label="Email">
          <el-input v-model="loginForm.email" size="large" placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            show-password
            placeholder="Введите пароль"
          />
        </el-form-item>
        <BaseButton
          type="primary"
          size="large"
          text="Войти"
          class="auth__submit"
          @click="onSubmit"
        />
      </el-form>

      <el-form
        v-else
        :model="registrationForm"
        label-position="top"
        class="auth__form"
        @submit.prevent="onSubmit"
        @keyup.enter="onSubmit"
      >
        <el-form-item label="Email">
          <el-input v-model="registrationForm.email" size="large" placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="Имя">
          <el-input
            v-model="registrationForm.name"
            size="large"
            placeholder="Как к вам обращаться"
          />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
            v-model="registrationForm.password"
            type="password"
            size="large"
            show-password
            placeholder="Придумайте пароль"
          />
        </el-form-item>
        <BaseButton
          type="primary"
          size="large"
          text="Зарегистрироваться"
          class="auth__submit"
          @click="onSubmit"
        />
      </el-form>

      <p class="auth__switch">
        <span>{{ isLoginMode ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?' }}</span>
        <button class="auth__switch-link" type="button" @click="switchMode">
          {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth {
  width: 100%;
  display: flex;
  justify-content: center;

  &__theme {
    position: fixed;
    top: 24px;
    right: 24px;
  }

  &__card {
    width: 100%;
    max-width: 420px;
    padding: 32px;
    background-color: var(--app-surface-raised);
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius);
    box-shadow: var(--app-shadow-md);
    transition:
      background-color var(--app-transition-slow),
      border-color var(--app-transition-slow);
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    text-align: center;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-bottom: 4px;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #fff;
    background-image: linear-gradient(135deg, var(--el-color-primary), #7b61ff);
    border-radius: var(--app-radius);
    box-shadow: var(--app-shadow-sm);
  }

  &__title {
    font-size: 22px;
    color: var(--el-text-color-primary);
  }

  &__subtitle {
    max-width: 300px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-secondary);
  }

  &__form {
    width: 100%;
  }

  &__submit {
    width: 100%;
    margin-top: 4px;
  }

  &__switch {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  &__switch-link {
    padding: 0;
    font: inherit;
    color: var(--el-color-primary);
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
