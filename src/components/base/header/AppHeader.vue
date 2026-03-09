<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
const userStore = useUserStore()

const userName = computed(() => userStore.userData?.name || '')
</script>

<template>
  <div class="header">
    <div class="user-panel">
      <div>{{ userName }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/main.scss' as *;
.header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid $gray-400;
}
</style>
