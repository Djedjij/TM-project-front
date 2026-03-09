import BoardsView from '@/views/BoardsView.vue'
import MainView from '@/views/MainView.vue'
import BoardItemView from '@/views/BoardItemView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/boards',
      name: 'boards',
      component: BoardsView,
    },
    {
      path: '/boards/:id',
      name: 'boardItem',
      component: BoardItemView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
