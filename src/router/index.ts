import { createRouter, createWebHistory } from 'vue-router'
import GetWords from '../views/GetWords.vue'
import EnglishWords from '../views/EnglishWords.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GetWords,
    },
    {
      path: '/en',
      name: 'English',
      component: EnglishWords,
    },
  ]
})

export default router
