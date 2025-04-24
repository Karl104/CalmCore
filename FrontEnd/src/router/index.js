import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/inspiration',
      name: 'inspiration',
      component: () => import('../views/InspirationView.vue'),
    },
  ],
})

export default router
