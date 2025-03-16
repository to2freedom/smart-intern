<template>
  <div class="dashboard-container">
    <!-- 个人信息模块 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="8">
        <el-card class="profile-card">
          <template #header>
            <div class="profile-header">
              <el-avatar :size="80" :src="userInfo.avatar" class="mr-3" />
              <div>
                <h2 class="m-0">{{ userInfo.name }}</h2>
                <p class="text-gray-500">{{ userInfo.targetPosition }}</p>
              </div>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="联系方式">
              <el-icon>
                <message />
              </el-icon>
              {{ userInfo.contact }}
            </el-descriptions-item>
            <el-descriptions-item label="毕业院校">
              <el-icon>
                <school />
              </el-icon>
              {{ userInfo.education }}
            </el-descriptions-item>
            <el-descriptions-item label="技术栈">
              <el-tag v-for="(tech, index) in userInfo.techStack" :key="index" class="mr-2 mb-2" type="info"
                size="small">
                {{ tech }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 技能雷达图 -->
      <el-col :xs="24" :sm="16">
        <el-card>
          <template #header>
            <div class="flex items-center">
              <el-icon class="mr-2"><data-analysis /></el-icon>
              <span>技能评估</span>
            </div>
          </template>
          <div ref="chartRef" class="h-96"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" :icon="Download" @click="exportToPDF">
        导出PDF简历
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import * as echarts from 'echarts'
import { Download, Message, School, DataAnalysis } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// 图表前置工作
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 用户数据
const userInfo = reactive({
  name: '任家恒',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  targetPosition: '前端开发实习生',
  contact: 'XXX@gmail.com',
  education: '中国矿业大学 - 地理信息科学',
  techStack: ['Vue3', 'TypeScript', 'Element Plus', 'Vite', 'Pinia', 'HTML', 'JavaScript', 'CSS']
})

// 图表初始化
const initChart = () => {
  if (!chartRef.value) return
  chartRef.value.style.height = '400px'
  chartRef.value.style.width = '100%'
  chartInstance = echarts.init(chartRef.value)
  const option = {
    radar: {
      indicator: [
        { name: 'HTML/CSS', max: 100 },
        { name: 'JavaScript', max: 100 },
        { name: 'Vue3', max: 100 },
        { name: 'TypeScript', max: 100 },
        { name: '工程化', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 5,
      axisName: {
        color: '#666'
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 90, 95, 88, 80],
        name: '技能评估',
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.2)'
        }
      }]
    }]
  }

  chartInstance.setOption(option)
}

// 导出PDF功能
const exportToPDF = async () => {
  const dashboard = document.querySelector('.dashboard-container')
  if (!dashboard) return

  const canvas = await html2canvas(dashboard as HTMLElement, {
    scale: 2,
    useCORS: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgWidth = 190
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
  pdf.save('resume.pdf')
}

// 挂载图表渲染
onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .profile-header {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }

  .action-buttons {
    text-align: center;
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;

      .el-avatar {
        margin-bottom: 10px;
      }
    }
  }
}
</style>