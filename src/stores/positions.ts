import { defineStore } from 'pinia'
import type { PositionBase } from '@/types'

export interface Position extends PositionBase {
  id: string
}

export const usePositionStore = defineStore('positions', {
  state: () => ({
    positions: [] as Position[]
  }),

  actions: {
    // 本地存储加载
    loadPositions() {
      const saved = localStorage.getItem('positions')
      if (saved) this.positions = JSON.parse(saved)
    },

    // 本地存储保存
    saveToLocal() {
      localStorage.setItem('positions', JSON.stringify(this.positions))
    },

    addPosition(position: PositionBase) {
      const newPosition = {
        ...position,
        id: Date.now().toString()
      }
      this.positions.unshift(newPosition)
      this.saveToLocal()
    },

    updatePosition(id: string, updates: Partial<PositionBase>) {
      const index = this.positions.findIndex(p => p.id === id)
      if (index !== -1) {
        this.positions[index] = { ...this.positions[index], ...updates }
        this.saveToLocal()
      }
    },

    deletePosition(id: string) {
      this.positions = this.positions.filter(p => p.id !== id)
      this.saveToLocal()
    }
  }
})