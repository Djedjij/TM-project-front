<script lang="ts" setup>
import { TBaseButtonProps } from './types'

withDefaults(defineProps<TBaseButtonProps>(), {
  size: 'default',
  type: 'primary',
  text: '',
})

defineEmits(['click'])
</script>

<template>
  <el-button
    @click="$emit('click')"
    :class="{
      btn: true,
      [`btn-${size}`]: size,
      [`btn-${type}`]: type,
    }"
    :type="type"
    :size="size"
    ><slot>{{ text }}</slot></el-button
  >
</template>

<style scoped>
.btn-default {
  padding: 5px 10px;
}
</style>
