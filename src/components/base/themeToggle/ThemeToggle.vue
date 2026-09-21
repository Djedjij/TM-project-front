<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const icon = computed(() => (isDark.value ? Sunny : Moon))
const title = computed(() => (isDark.value ? 'Включить светлую тему' : 'Включить тёмную тему'))
</script>

<template>
  <el-tooltip :content="title" placement="bottom" :show-after="300">
    <button
      class="theme-toggle"
      type="button"
      :aria-label="title"
      :aria-pressed="isDark"
      @click="themeStore.toggleTheme()"
    >
      <el-icon class="theme-toggle__icon">
        <component :is="icon" />
      </el-icon>
    </button>
  </el-tooltip>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--el-text-color-regular);
  background-color: var(--app-surface-muted);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-pill);
  cursor: pointer;
  transition:
    color var(--app-transition),
    background-color var(--app-transition),
    border-color var(--app-transition),
    transform var(--app-transition);

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }

  &__icon {
    font-size: 18px;
    transition: transform var(--app-transition-slow);
  }

  &:hover &__icon {
    transform: rotate(-20deg);
  }
}
</style>
