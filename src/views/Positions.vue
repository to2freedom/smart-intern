<template>
  <div class="position-container">
    <BasicSearchTable :fetching="loading" v-model:search="search" :initial="initial" :columns="column"
      :data="filteredPositions" :pagination="pagination" :filters="filters" @search="onSearch" @reset="onReset">
      <template #actions>
        <div class="domain">
          <el-col :span="6" class="text-right">
            <el-button type="primary" @click="showAddDialog">
              <el-icon class="mr-1">
                <Plus />
              </el-icon>
              新增岗位
            </el-button>
          </el-col>
        </div>
      </template>
      <template #column-status="{ row }">
        <el-tag :type="statusStyle[row.status].type" effect="dark">
          {{ statusStyle[row.status].label }}
        </el-tag>
      </template>
      <template #column-appliedDate="{ row }">
        {{ formatDate(row.appliedDate) }}
      </template>
      <template #column-operate="{ row }">
        <el-button size="small" @click="editPosition(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deletePosition(row.id)">
          删除
        </el-button>
      </template>
    </BasicSearchTable>

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
import { Plus } from '@element-plus/icons-vue'
import { usePositionStore } from '@/stores/positions'
import type { Position, IStatusStyle } from '@/types'
import { ElMessageBox, ElMessage } from 'element-plus'
import BasicSearchTable from "@/components/BasicSearchTable.vue";
import type { TableColumn, TableFilter } from '@/components/BasicSearchTable.vue'


const positionStore = usePositionStore()
const { positions, loading } = storeToRefs(positionStore)

// 状态定义
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const currentId = ref<string | null>(null)

//表单基础框架定义
const column = computed<TableColumn[]>(() => [
  { label: '公司', prop: 'company' },
  { label: '职位', prop: 'position' },
  { label: '状态', prop: 'status' },
  { label: '申请日期', prop: 'appliedDate' },
  { label: "操作", prop: 'operate' }
])

//表单搜索部分定义
const filters = computed<TableFilter[]>(() => [
  { label: '公司', prop: 'company', render: 'el-input' },
  { label: '职位', prop: 'position', render: 'el-input' },
  { label: '状态', prop: 'status', render: 'el-select', options: statusOptions },
  { label: '申请日期', prop: 'appliedDate', render: 'el-date-picker' },
])

const search = ref({
  company: '',
  position: '',
  status: '',
  appliedDate: ''
})

const initial = {
  comapny: '',
  company: '',
  position: '',
  status: '',
  appliedDate: ''
}

const statusOptions = [
  { label: '已投递', value: 'pending' },
  { label: '面试中', value: 'interviewing' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已录用', value: 'offered' },
]
//分页规则设置
const pagination = computed(() => ({
  page: 1,
  size: 20,
  total: 50,
}))

// 对表单初始值设置
const form = ref<Omit<Position, 'id'>>({
  company: '',
  position: '',
  status: 'pending',
  appliedDate: new Date().toISOString().split('T')[0],
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
  return positions.value
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
    positionStore.createPosition(form.value)
  }

  dialogVisible.value = false
  positionStore.fetchPositions()
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

//搜索岗位和重置搜索
function onSearch(form: any) {
  delete form._
  positionStore.searchPositions(form)
}

function onReset() {
}

onMounted(() => {
  positionStore.fetchPositions()
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

.domain {
  display: flex;
  justify-content: right
}
</style>