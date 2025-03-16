import { defineStore } from 'pinia'
import type { Skill, LearningPlan } from '@/types'

export const useSkillStore = defineStore('skills', {
  state: () => ({
    skills: [] as Skill[],
    plans: [] as LearningPlan[]
  }),

  actions: {
    loadFromLocal() {
      const savedSkills = localStorage.getItem('skills')
      if (savedSkills) this.skills = JSON.parse(savedSkills)

      const savedPlans = localStorage.getItem('plans')
      if (savedPlans) this.plans = JSON.parse(savedPlans)
    },

    saveToLocal() {
      localStorage.setItem('skills', JSON.stringify(this.skills))
      localStorage.setItem('plans', JSON.stringify(this.plans))
    },

    updateProgress(skillId: string, hours: number) {
      const skill = this.skills.find(s => s.id === skillId)
      if (skill) {
        skill.completedHours = Math.min(
          skill.completedHours + hours,
          skill.targetHours
        )
        this.saveToLocal()
      }
    },

    addPlan(plan: Omit<LearningPlan, 'id'>) {
      this.plans.push({
        ...plan,
        id: Date.now().toString()
      })
      this.saveToLocal()
    }
  },

  getters: {
    skillProgress(): Array<Skill & { progress: number }> {
      return this.skills.map(skill => ({
        ...skill,
        progress: (skill.completedHours / skill.targetHours) * 100
      }))
    }
  }
})