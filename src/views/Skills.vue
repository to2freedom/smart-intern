<template>
  <div class="skills-container">
    <!-- 构造技能树 -->
    <el-card class="skill-tree-section">
      <template #header>
        <h3>前端技能树</h3>
      </template>
      <SkillTree :skills="skillStore.skills" />
    </el-card>

    <!-- 进度管理 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="flex justify-between">
              <span style="flex: 1; margin-right: 16px">技能进度</span>
              <el-button type="primary" size="small" class="ml-0" @click="showAddDialog">
                添加训练记录
              </el-button>
            </div>
          </template>

          <el-table :data="skillStore.skillProgress">
            <el-table-column prop="name" label="技能" />
            <el-table-column label="进度" width="150">
              <template #default="{ row }">
                <ProgressRing :progress="row.progress" />
                {{ row.completedHours }}h / {{ row.targetHours }}h
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 最近训练记录 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近训练</span>
          </template>
          <el-timeline>
            <el-timeline-item v-for="plan in recentPlans" :key="plan.id" :timestamp="plan.date">
              {{ plan.note }}（{{ plan.duration }}小时）
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加训练记录对话框 -->
    <el-dialog v-model="dialogVisible" title="添加训练记录">
      <el-form :model="newPlan">
        <el-form-item label="选择技能">
          <el-select v-model="newPlan.skillId">
            <el-option v-for="skill in skillStore.skills" :key="skill.id" :label="skill.name" :value="skill.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="训练时长">
          <el-input-number v-model="newPlan.duration" :min="0.5" :step="0.5" />
        </el-form-item>
        <el-form-item label="训练内容">
          <el-input v-model="newPlan.note" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPlan">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSkillStore } from '@/stores/skills'
import SkillTree from '@/components/skills/SkillTree.vue'
import ProgressRing from '@/components/skills/ProgressRing.vue'
import { initialSkills } from "@/utils/skillData";

const skillStore = useSkillStore()


const dialogVisible = ref(false)
const newPlan = ref({
  skillId: '',
  duration: 1,
  note: ''
})

const recentPlans = computed(() => {
  return [...skillStore.plans].reverse().slice(0, 5)
})

const showAddDialog = () => {
  dialogVisible.value = true
}

const submitPlan = () => {
  skillStore.addPlan({
    ...newPlan.value,
    date: new Date().toISOString().split('T')[0]
  })
  skillStore.updateProgress(newPlan.value.skillId, newPlan.value.duration)
  dialogVisible.value = false
  newPlan.value = { skillId: '', duration: 1, note: '' }
}

onMounted(() => {
  skillStore.loadFromLocal()
  if (skillStore.skills.length === 0) {
    if (!initialSkills.some(s => s.id === 'root')) {
      initialSkills.unshift({
        id: 'root',
        name: '前端开发',
        category: 'foundation',
        targetHours: 0,
        completedHours: 0,
        dependencies: ['vue']
      })
    }
    skillStore.skills = initialSkills
    skillStore.saveToLocal()
  }
})
</script>