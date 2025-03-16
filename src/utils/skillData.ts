import type { Skill } from '@/types'

export const initialSkills: Skill[] = [
  {
    id: 'root',
    name: '前端开发',
    category: 'foundation',
    targetHours: 0,
    completedHours: 0,
    dependencies: ['vue3']
  },
  {
    id: 'vue3',
    name: 'Vue3 开发',
    category: 'frontend',
    targetHours: 50,
    completedHours: 30,
    dependencies: ['typescript']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    targetHours: 40,
    completedHours: 20,
    dependencies: ['nodejs']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    targetHours: 60,
    completedHours: 10,
    dependencies: []
  }
]