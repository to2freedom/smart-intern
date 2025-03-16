<template>
  <div class="position-container">
    <!-- 搜索和添加按钮 -->
    <el-row class="mb-4">
      <el-col :span="18">
        <el-input v-model="searchKey" placeholder="搜索公司或职位" clearable>
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-button type="primary" @click="showAddDialog">
          <el-icon class="mr-1">
            <Plus />
          </el-icon>
          新增岗位
        </el-button>
      </el-col>
    </el-row>

    <!-- 岗位列表 -->
    <el-table :data="filteredPositions" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="company" label="公司" width="180" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusStyle[row.status].type" effect="dark">
            {{ statusStyle[row.status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appliedDate" label="申请日期" width="120">
        <template #default="{ row }">
          {{ formatDate(row.appliedDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="editPosition(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deletePosition(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑岗位' : '新增岗位'" width="500">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="公司" prop="company">
          <el-input v-model="form.company" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option v-for="(item, key) in statusStyle" :key="key" :label="item.label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker v-model="form.appliedDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search, Plus } from '@element-plus/icons-vue'
import { usePositionStore } from '@/stores/positions'
import type { Position, IStatusStyle } from '@/types'
import { ElMessageBox, ElMessage } from 'element-plus'

const positionStore = usePositionStore()
const { positions } = storeToRefs(positionStore)

// 状态定义
const searchKey = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const formRef = ref()
const currentId = ref<string | null>(null)

// 对表单初始值设置
const form = ref<Omit<Position, 'id'>>({
  company: '',
  position: '',
  status: 'pending',
  appliedDate: new Date().toISOString().split('T')[0]
})

// 状态样式配置
const statusStyle: IStatusStyle = {
  pending: { type: 'info', label: '已投递' },
  interviewing: { type: 'warning', label: '面试中' },
  rejected: { type: 'danger', label: '已拒绝' },
  offered: { type: 'success', label: '已录用' }
}

// 表单验证规则
const rules = {
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位名称', trigger: 'blur' }]
}

// 计算属性
const filteredPositions = computed(() => {
  return positions.value.filter(p =>
    p.company.toLowerCase().includes(searchKey.value.toLowerCase()) ||
    p.position.toLowerCase().includes(searchKey.value.toLowerCase()))
})

// 日期格式化
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  form.value = {
    company: '',
    position: '',
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0]
  }
  dialogVisible.value = true
}

// 编辑岗位
const editPosition = (position: Position) => {
  isEdit.value = true
  currentId.value = position.id
  form.value = { ...position }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  await formRef.value.validate()

  if (isEdit.value && currentId.value) {
    positionStore.updatePosition(currentId.value, form.value)
  } else {
    positionStore.addPosition(form.value)
  }

  dialogVisible.value = false
}

// 删除岗位
const deletePosition = (id: string) => {
  ElMessageBox.confirm('确定要删除该岗位吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    positionStore.deletePosition(id)
    ElMessage.success('删除成功')
  })
}

onMounted(() => {
  positionStore.loadPositions()
})
</script>

<style scoped>
.position-container {
  padding: 20px;
}

.text-right {
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

:deep(.el-table__cell) {
  padding: 12px 0;
}
</style>