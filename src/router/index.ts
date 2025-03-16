import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '个人主页' }
  },
  {
    path: '/positions',
    component: () => import('@/views/Positions.vue'),
    meta: { title: '岗位管理' }
  },
  {
    path: '/skills',
    component: () => import('@/views/Skills.vue'),
    meta: { title: '技能训练' }
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
