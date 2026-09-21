import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
// Тёмная тема Element Plus и стили сообщений (ElMessage) — до стилей приложения
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import './assets/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
useThemeStore().initialize()
app.mount('#app')
