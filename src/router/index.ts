import { createRouter, createWebHistory } from 'vue-router'
import GetWords from '../views/GetWords.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GetWords,
    },
  ]
})

export default router
