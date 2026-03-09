<script setup lang="ts">
import { reactive, ref } from 'vue'
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
</script>

<template>
  <div class="wrapper">
    <div class="form" v-if="mode === 'login'">
      <el-form :model="loginForm" label-width="auto" style="max-width: 600px">
        <el-form-item label="Email">
          <el-input v-model="loginForm.email" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input type="password" v-model="loginForm.password" />
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="loginUser(loginForm)">Войти</el-button>
        </div>
      </el-form>
      <div @click="() => (mode = 'registration')">Зарегистрироваться</div>
    </div>
    <div class="form" v-else>
      <el-form :model="registrationForm" label-width="auto" style="max-width: 600px">
        <el-form-item label="Email">
          <el-input v-model="registrationForm.email" />
        </el-form-item>
        <el-form-item label="Имя">
          <el-input v-model="registrationForm.name" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input type="password" v-model="registrationForm.password" />
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="registerUser(registrationForm)"
            >Зарегистрироваться</el-button
          >
        </div>
        <div @click="() => (mode = 'login')">Войти</div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 100px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.form-actions {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
