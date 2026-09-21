<template>
  <el-card class="wrapper">
    <template #header>
      <div class="wrapper_header">
        <router-link :to="`/projects/${project.id}`">{{ project.title }}</router-link>
        <base-tag :type="project.status" :text="projectStatusTitle" />
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { EProjectStatus, TProject } from '@/api/projects/types'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { computed } from 'vue'

const props = defineProps<{
  project: TProject
}>()

const projectStatusTitle = computed(() => {
  switch (props.project.status) {
    case EProjectStatus.active:
      return 'Активный'
    case EProjectStatus.paused:
      return 'На паузе'
    default:
      return 'Нет статуса'
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/main.scss' as *;

.wrapper {
  width: 350px;
  max-width: 350px;
  height: 150px;
  display: flex;
  border-radius: 4px;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
