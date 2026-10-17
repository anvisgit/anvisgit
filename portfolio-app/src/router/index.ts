import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoadingView from '../views/LoadingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'opening',
      component: LoadingView,
    },
    {
      path: '/home',
      redirect: { name: 'opening' },
    },
    {
      path: '/portfolio',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
