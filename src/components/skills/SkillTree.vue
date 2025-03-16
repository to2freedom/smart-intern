<template>
  <div ref="chartEl" style="height: 400px;width: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { Skill } from '@/types'
import Skills from '@/views/Skills.vue';


const props = defineProps<{
  skills: Skill[]
}>()

const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartEl.value || props.skills.length === 0) return
  if (!chartEl.value) return

  chart = echarts.init(chartEl.value)
  const options = {
    tooltip: {},
    series: {
      type: 'tree',
      data: [formatData()],
      orient: 'vertical',
      label: {
        position: 'left',
        fontSize: 14
      }
    }
  }
  chart.setOption(options)
}

// 递归调用得到节点对象
const formatData = () => {
  console.log('当前技能数据:', props.skills)
  const rootSkill = props.skills.find(s => s.id === 'root')

  if (!rootSkill) {
    console.error('未找到根节点技能')
    return { name: '技能树' }
  }

  const buildNode: any = (skillId: string) => {
    const skill = props.skills.find(s => s.id === skillId)
    console.log(skill!.dependencies)
    if (!skill) {
      console.warn(`未找到技能: ${skillId}`)
      return { name: '未知技能' }
    }

    return {
      name: skill.name,
      children: skill.dependencies?.map(buildNode) || []
    }
  }

  return buildNode(rootSkill.id)
}
// 添加watch监视避免异步传输用空数组渲染
watch(() => props.skills, (newVal) => {
  if (newVal.length > 0) {
    initChart()
  }
}, { immediate: true })

onMounted(initChart)
</script>