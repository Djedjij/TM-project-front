<script setup lang="ts">
import { onMounted } from 'vue'
import AppSidebar from './components/base/AppSidebar.vue'
import { useUserStore } from './stores/user'
import AppHeader from './components/base/header/AppHeader.vue'

const userStore = useUserStore()

onMounted(() => userStore.initialize())
</script>

<template>
  <div v-if="userStore.isAuhtorized" class="app">
    <AppHeader />
    <div class="app-body">
      <AppSidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>

  <div v-else><router-view /></div>
</template>

<style lang="scss">
.app-body {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.app-main {
  width: 100%;
  padding: 20px;
}
</style>
