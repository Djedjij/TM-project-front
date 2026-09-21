<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { EProjectStatus, TProject } from '@/api/projects/types'

const props = defineProps<{
  project: TProject
}>()

const router = useRouter()

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

const openProject = () => {
  router.push({ name: 'projectItem', params: { id: props.project.id } })
}
</script>

<template>
  <el-card
    class="wrapper"
    shadow="hover"
    role="button"
    tabindex="0"
    @click="openProject"
    @keydown.enter.prevent="openProject"
  >
    <template #header>
      <div class="wrapper__header">
        <h3 class="wrapper__title">{{ project.title }}</h3>
        <BaseTag v-if="project.status" :type="project.status" :text="projectStatusTitle" />
      </div>
    </template>

    <p class="wrapper__description">{{ project.description || 'Описание не заполнено' }}</p>

    <span class="wrapper__footer">
      Открыть проект
      <el-icon><ArrowRight /></el-icon>
    </span>
  </el-card>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
    word-break: break-word;
  }

  &__description {
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-regular, #606266);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 16px;
    font-size: 14px;
    color: var(--el-color-primary, #409eff);
  }
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
