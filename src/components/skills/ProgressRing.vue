<template>
  <svg :width="size" :height="size">
    <circle cx="50%" cy="50%" :r="radius" fill="none" stroke="#eee" :stroke-width="strokeWidth" />
    <circle cx="50%" cy="50%" :r="radius" fill="none" :stroke="color" :stroke-width="strokeWidth"
      :stroke-dasharray="dashArray" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 36
  },
  strokeWidth: {
    type: Number,
    default: 4
  },
  color: {
    type: String,
    default: '#409EFF'
  }
})

const radius = computed(() => props.size / 2 - props.strokeWidth)
const dashArray = computed(() => {
  const circumference = 2 * Math.PI * radius.value
  return `${circumference * props.progress / 100} ${circumference}`
})
</script>