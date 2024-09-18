import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  { path: '/login', component: async () => import('@/views/login/index.vue') },
]

const routers = createRouter({
  history: createWebHistory(),
  routes,
})

export default routers
