<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import ThemeToggle from '@/components/base/themeToggle/ThemeToggle.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userName = computed(() => userStore.userData?.name || 'Пользователь')
const userInitial = computed(() => userName.value.trim().charAt(0).toUpperCase() || 'U')

const { logoutUser } = userStore
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <router-link class="header__brand" :to="{ name: 'home' }">
        <span class="header__logo">TM</span>
        <span class="header__brand-text">Task Manager</span>
      </router-link>

      <div class="header__actions">
        <ThemeToggle />

        <el-dropdown trigger="click">
          <button class="user-panel" type="button">
            <span class="user-panel__avatar">{{ userInitial }}</span>
            <span class="user-panel__name">{{ userName }}</span>
            <el-icon class="user-panel__arrow"><arrow-down /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="SwitchButton" @click="logoutUser">Выйти</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: var(--app-header-bg);
  border-bottom: 1px solid var(--app-border);
  backdrop-filter: blur(12px);
  transition:
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);

  &__inner {
    max-width: 1200px;
    height: 64px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    text-decoration: none;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #fff;
    background-image: linear-gradient(135deg, var(--el-color-primary), #7b61ff);
    border-radius: var(--app-radius-sm);
    box-shadow: var(--app-shadow-sm);
  }

  &__brand-text {
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  font: inherit;
  font-size: 14px;
  color: var(--el-text-color-regular);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--app-radius-pill);
  cursor: pointer;
  outline: none;
  transition:
    color var(--app-transition),
    background-color var(--app-transition),
    border-color var(--app-transition);

  &:hover {
    color: var(--el-text-color-primary);
    background-color: var(--app-surface-muted);
    border-color: var(--app-border);
  }

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary-light-7);
    border-radius: var(--app-radius-pill);
  }

  &__name {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

@media (max-width: 600px) {
  .header {
    &__inner {
      padding: 0 16px;
    }

    &__brand-text {
      display: none;
    }
  }

  .user-panel__name {
    display: none;
  }
}
</style>
