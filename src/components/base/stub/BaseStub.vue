<script setup lang="ts">
import { TBaseStubProps } from './types'

withDefaults(defineProps<TBaseStubProps>(), {
  description: 'Нет данных',
})
</script>

<template>
  <div class="stub">
    <el-empty :description="description" :image-size="110" />
  </div>
</template>

<style lang="scss" scoped>
.stub {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 24px;
  background-color: var(--app-surface);
  border: 1px dashed var(--app-border-strong);
  border-radius: var(--app-radius);
  transition:
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);
}
</style>
