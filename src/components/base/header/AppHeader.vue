<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, Right } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userName = computed(() => userStore.userData?.name || '')

const { logoutUser } = userStore
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <router-link class="header__brand" :to="{ name: 'home' }">Task Manager</router-link>

      <div class="user-panel">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ userName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoutUser" :icon="Right">Выйти</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/main.scss' as *;

.header {
  width: 100%;
  background-color: $white;
  border-bottom: 1px solid $gray-400;

  &__inner {
    max-width: 1200px;
    height: 64px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__brand {
    font-size: 20px;
    font-weight: 600;
    color: $gray-900;
    text-decoration: none;
  }
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: $gray-700;
  outline: none;
}
</style>
