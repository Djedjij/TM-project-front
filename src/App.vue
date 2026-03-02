<script setup lang="ts">
import AppSidebar from './components/base/AppSidebar.vue'
</script>

<template>
  <div class="app-body">
    <AppSidebar />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
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
