<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { $clone } from '@/utils/index.t'
import type { FormInstance } from 'element-plus'
import { isDefined } from '@/utils/index.t'

interface SharedFilter {
  label: string
  prop: string
  placeholder?: string
  show?: boolean | Function
  hidden?: boolean | Function
  isNotShowAll?: boolean | Function
}
interface FilterInput extends SharedFilter {
  render: 'el-input'
  type?: 'text' | 'number'
}
interface FilterSelect extends SharedFilter {
  render: 'el-select'
  options: { label: string, value: string | number }[]
}
interface FilterDate extends SharedFilter {
  render: 'el-date-picker'
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year' | 'week'
  unlinkPanels?: 'true' | 'false'
}
interface FilterCustom extends SharedFilter {
  render: 'custom'
}

export type TableFilter = FilterInput | FilterSelect | FilterDate | FilterCustom

export interface TableColumn {
  label: string
  prop: string
  width?: string | number
  minWidth?: string | number
  render?: (row: any, column: TableColumn) => any
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: any
  sortMethod?: (a: any, b: any) => number
  formatter?: (row: any, column: TableColumn) => any
  className?: string
  children?: TableColumn[]
  show?: boolean | Function
  hidden?: boolean | Function
  sortOrders?: ('ascending' | 'descending' | null)[]
}

const props = withDefaults(defineProps<{
  fetching: boolean
  error?: any
  initial: any
  filters?: TableFilter[]
  columns: TableColumn[]
  data: any[]
  pagination: { total: number, page: number, size: number }
  selectable?: boolean
  rowClassName?: (data: { row: any, rowIndex: number }) => string
  isSetTableHeight?: boolean
  isShowFilterExpand?: boolean
}>(), {
  filters: () => [],
  rowClassName: () => '',
})

const emit = defineEmits<{
  (event: 'search', form: any): void
  (event: 'reset'): void
  (event: 'changePage', page: number): void
  (event: 'changeSize', size: number): void
  (event: 'onEnableSelect', data: any): void
  (event: 'onSortChange', value: any): void
}>()

const search = defineModel('search', {
  required: false,
  default: {},
})
const searchRef = ref<FormInstance>()

function onSubmit() {
  emit('search', { ...$clone(search.value), _: Date.now().toString() })
}
function onReset() {
  search.value = { ...$clone(props.initial) }
  emit('reset')
}

const selections = defineModel<any[]>('selections', {
  required: false,
  default: [],
})
function onSelectionChange(rows: any[]) {
  selections.value = rows
}

const computedFilters = computed(() => {
  return props.filters
    .filter((filter) => {
      if (isDefined(filter.show)) {
        if (typeof filter.show === 'function')
          return filter.show()
        return filter.show
      }
      else if (isDefined(filter.hidden)) {
        if (typeof filter.hidden === 'function')
          return !filter.hidden()
        return !filter.hidden
      }
      return true
    })
    .map((filter) => {
      if (filter.render === 'el-select') {
        filter.options = filter.options ?? []
        const hasAllOption = filter.options.some(option => option.label === '全部')
        if (!hasAllOption && !filter.isNotShowAll) {
          filter.options.unshift({ label: '全部', value: '' })
        }
      }
      return filter
    })
})

const computedColumns = computed(() => {
  return props.columns
    .filter((field) => {
      if (isDefined(field.show)) {
        if (typeof field.show === 'function')
          return field.show()
        return field.show
      }
      else if (isDefined(field.hidden)) {
        if (typeof field.hidden === 'function')
          return !field.hidden()
        return !field.hidden
      }
      return true
    })
})
function hanleSelectable(row: Record<string, any>) {
  let result = true
  emit('onEnableSelect', {
    text: row,
    fn: (isEnableSelect) => {
      result = isEnableSelect
    },
  })
  return result
}
function onSortChange(params: any) {
  emit('onSortChange', params)
}
const tableRef = ref<any>()
onMounted(() => {
  if (props.isSetTableHeight) {
    nextTick(() => {
      setTableHeight()
      window.addEventListener('resize', setTableHeight)
    })
  }
})
const tableHeight = ref(0)
function setTableHeight() {
  const currenyTable = tableRef.value?.$el
  const tableTop = currenyTable.getBoundingClientRect().top
  const screenHeight = window.screen.height
  tableHeight.value = screenHeight - tableTop - 170
}
const isExpanded = ref(true)
function handleCollapse() {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    setTableHeight()
  })
}
</script>

<template>
  <div>
    <!-- Search -->
    <div v-if="computedFilters.length" flex="~ row">
      <div v-if="isShowFilterExpand" class="mb-10px h-20px flex items-center justify-between px-20px">
        <span class="text-14px">{{ isExpanded ? '' : '搜索项：' }}</span>
        <el-button type="primary" link @click="handleCollapse">
          {{ !isExpanded ? '展开' : '收起' }}
        </el-button>
      </div>
      <template v-if="isExpanded">
        <el-form ref="searchRef" :model="search" inline label-width="auto" @submit.prevent="onSubmit"
          @reset.prevent="onReset">
          <el-form-item v-for="filter in computedFilters" :key="filter.prop" :label="filter.label">
            <template v-if="$slots[`filter-${filter.prop}`]">
              <slot :name="`filter-${filter.prop}`" :filter="filter" />
            </template>
            <template v-else>
              <!-- el-input -->
              <el-input v-if="filter.render === 'el-input'" v-model="search[filter.prop]" :type="filter.type ?? 'text'"
                class="w-50!" clearable :placeholder="`请输入${filter.label}`" />
              <!-- el-select -->
              <el-select v-else-if="filter.render === 'el-select'" v-model="search[filter.prop]" class="w-50!" clearable
                filterable :placeholder="`请选择${filter.label}`">
                <el-option v-for="option in filter.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
              <!-- el-date-picker -->
              <el-date-picker v-else-if="filter.render === 'el-date-picker'" v-model="search[filter.prop]"
                :type="filter.type" clearable :placeholder="`请选择${filter.label}`" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                :unlink-panels="filter.unlinkPanels" />
            </template>
          </el-form-item>
          <el-form-item label=" ">
            <div class="flex items-center gap-2">
              <el-button :loading="fetching" type="primary" native-type="submit" :disabled="fetching">
                <template #default>
                  <div class="flex items-center justify-between gap-1">
                    <icon-ep-search v-if="!fetching" />
                    <span>搜索</span>
                  </div>
                </template>
              </el-button>
              <el-button :loading="fetching" type="default" native-type="reset" :disabled="fetching">
                <template #default>
                  <div class="flex items-center justify-between gap-1">
                    <icon-ep-refresh v-if="!fetching" />
                    <span>重置</span>
                  </div>
                </template>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </div>

    <!-- Actions -->
    <template v-if="$slots.actions">
      <el-divider v-if="computedFilters.length" class="mt-0!" />
      <div class="my-4">
        <slot name="actions" />
      </div>
    </template>

    <!-- Table -->
    <el-alert v-if="error" title="错误" type="error" :description="JSON.stringify(error)" />
    <el-table ref="tableRef" :key="JSON.stringify(data)" v-loading="fetching"
      :height="props.isSetTableHeight && data?.length > 10 ? tableHeight : 'auto'" :data="data"
      :row-class-name="rowClassName" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column v-if="props.selectable" type="selection" :selectable="hanleSelectable" width="55" />
      <el-table-column v-for="column in computedColumns" :key="column.prop" :label="column.label" :prop="column.prop"
        :fixed="column.fixed" :width="column.width" :min-width="column.minWidth" :sortable="column.sortable"
        :sort-orders="column.sortOrders" :formatter="(column.formatter as any)">
        <template v-if="!column.formatter" #default="{ row }">
          <slot v-if="$slots[`column-${column.prop}`]" :name="`column-${column.prop}`" :row="row">
            <span>{{ row[column.prop] }}</span>
          </slot>
          <div v-else-if="!column.prop.includes('.')">
            {{ (row[column.prop] || row[column.prop] === 0) ? row[column.prop] : '-' }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-end">
      <el-pagination v-if="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20, 50, 100, 500, 1000]" :default-current-page="1" :default-page-size="20"
        :total="pagination.total" :current-page="pagination.page" :page-size="pagination.size"
        @current-change="(page: number) => $emit('changePage', page)"
        @size-change="(size: number) => $emit('changeSize', size)" />
    </div>
  </div>
</template>
