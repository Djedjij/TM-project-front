<script lang="ts" setup>
import { computed } from 'vue'
import { TBaseModalProps } from './types'

const props = defineProps<TBaseModalProps>()
const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="800">
    <slot />
  </el-dialog>
</template>

<style scoped></style>
>
