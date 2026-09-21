<script setup lang="ts">
import { TBaseTagProps } from './types'

withDefaults(defineProps<TBaseTagProps>(), {
  text: '',
  type: 'primary',
  size: 'default',
})

const getTypeForTag = (type: string) => {
  switch (type) {
    case 'active':
    case 'success':
      return 'success'
    case 'paused':
    case 'warning':
      return 'warning'
    case 'primary':
      return 'primary'
    case 'info':
      return 'info'
    case 'danger':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<template>
  <el-tag class="tag" :type="getTypeForTag(type)" :size="size">{{ text }}</el-tag>
</template>

<style lang="scss" scoped>
.tag {
  padding: 3px 10px;
  font-weight: 500;
  border-radius: var(--app-radius-pill);
}
</style>
