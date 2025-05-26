import { defineStore } from 'pinia'
import type { Position, PositionBase } from '@/types'
import axios, { AxiosError } from 'axios'

//构建基础网络请求
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: { 'X-Custom-Header': 'Pinia-Store' }
})

export const usePositionStore = defineStore('positions', {
  state: () => ({
    positions: [] as Position[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    // 标准化错误处理
    handleError(error: AxiosError) {
      this.error = error.response?.data?.message || error.message
      setTimeout(() => this.error = null, 5000)
    },

    //模拟网络请求获得数据
    async fetchPositions(params?: Record<string, unknown>) {
      this.loading = true
      try {
        const { data } = await api.get<Position[]>('/positions', { params })
        this.positions = data
      } catch (error) {
        this.handleError(error as AxiosError)
      } finally {
        this.loading = false
      }
    },

    // 带乐观更新的创建
    async createPosition(position: Omit<Position, 'id'>) {
      const tempId = `temp-${Date.now()}`
      this.positions.unshift({
        ...position,
        id: tempId,
      })

      try {
        const { data } = await api.post<Position>('/positions', position)
        // 替换临时ID
        const index = this.positions.findIndex(p => p.id === tempId)
        if (index !== -1) this.positions.splice(index, 1, data)
      } catch (error) {
        // 回滚操作
        this.positions = this.positions.filter(p => p.id !== tempId)
        this.handleError(error as AxiosError)
      }
    },

    // 带版本控制的更新
    async updatePosition(id: string, updates: Partial<PositionBase>) {
      const original = this.positions.find(p => p.id === id)
      if (!original) return

      const index = this.positions.indexOf(original)
      this.positions[index] = { ...original, ...updates }

      try {
        await api.patch<Position>(`/positions/${id}`, updates)
      } catch (error) {
        // 版本冲突回滚
        this.positions[index] = original
        this.handleError(error as AxiosError)
      }
    },

    // 带预删除的移除
    async deletePosition(id: string) {
      const original = this.positions.find(p => p.id === id)
      this.positions = this.positions.filter(p => p.id !== id)

      try {
        await api.delete(`/positions/${id}`)
      } catch (error) {
        // 恢复删除项
        if (original) this.positions.push(original)
        this.handleError(error as AxiosError)
      }
    },

    //搜索功能
    async searchPositions(searchParams: {
      company?: string;
      position?: string;
      status?: string;
      appliedDate?: string;
    }) {
      this.loading = true;
      try {
        // 构建符合 JSON-Server 特性的查询参数
        const queryParams = {
          // _embed: 'interviews',       // 关联面试记录
          _sort: 'appliedDate',      // 默认按申请日期排序
          _order: 'desc',            // 降序排列
          company_like: searchParams.company?.trim(),  // 模糊匹配公司名
          position_like: searchParams.position?.trim(), // 模糊匹配职位名
          status: searchParams.status,
          appliedDate_gte: searchParams.appliedDate,    // 日期范围查询
          appliedDate_lte: searchParams.appliedDate
        };

        // 过滤空值参数
        const filteredParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== '')
        );
        const { data } = await api.get<Position[]>('/positions', {
          params: filteredParams
        });


        this.positions = data
      } catch (error) {
        this.handleError(error as AxiosError);
        // 失败时回滚显示完整列表
        await this.fetchPositions();
      } finally {
        this.loading = false;
      }
    }
  }
})