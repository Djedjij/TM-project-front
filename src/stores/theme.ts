import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type TTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'app-theme'
const DARK_THEME_CLASS = 'dark'

const getSystemTheme = (): TTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getStoredTheme = (): TTheme | null => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<TTheme>(getStoredTheme() ?? getSystemTheme())
  const isInitialized = ref(false)

  const isDark = computed(() => theme.value === 'dark')

  const applyTheme = () => {
    document.documentElement.classList.toggle(DARK_THEME_CLASS, isDark.value)
  }

  const setTheme = (value: TTheme) => {
    theme.value = value
    localStorage.setItem(THEME_STORAGE_KEY, value)
    applyTheme()
  }

  const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')

  const initialize = () => {
    if (isInitialized.value) return

    isInitialized.value = true
    applyTheme()

    // Пока пользователь не выбрал тему вручную — следуем системной настройке
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (getStoredTheme()) return

      theme.value = event.matches ? 'dark' : 'light'
      applyTheme()
    })
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initialize,
  }
})
