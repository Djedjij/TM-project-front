<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './components/base/header/AppHeader.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => userStore.initialize())
</script>

<template>
  <div class="app">
    <AppHeader v-if="userStore.isAuhtorized" />

    <main class="app-main" :class="{ 'app-main_auth': !userStore.isAuhtorized }">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  color: var(--el-text-color-primary);
  background-color: var(--app-bg);
  background-image: radial-gradient(circle at 20% 0%, var(--app-bg-glow), transparent 55%);
  background-attachment: fixed;
  transition:
    background-color var(--app-transition-slow),
    color var(--app-transition-slow);
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.app-main_auth {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

@media (max-width: 600px) {
  .app-main {
    padding: 20px 16px 32px;
  }
}
</style>

