<script setup lang="ts">
import { TBaseStubProps } from './types'

withDefaults(defineProps<TBaseStubProps>(), {
  description: 'Нет данных',
})
</script>

<template>
  <el-empty :description="description"></el-empty>
</template>
