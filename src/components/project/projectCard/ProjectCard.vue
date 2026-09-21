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
    class="card"
    shadow="hover"
    role="button"
    tabindex="0"
    @click="openProject"
    @keydown.enter.prevent="openProject"
  >
    <template #header>
      <div class="card__header">
        <h3 class="card__title">{{ project.title }}</h3>
        <BaseTag v-if="project.status" :type="project.status" :text="projectStatusTitle" />
      </div>
    </template>

    <p class="card__description">{{ project.description || 'Описание не заполнено' }}</p>

    <span class="card__footer">
      Открыть проект
      <el-icon class="card__footer-icon"><ArrowRight /></el-icon>
    </span>
  </el-card>
</template>

<style scoped lang="scss">
.card {
  --el-card-border-color: var(--app-border);
  --el-card-border-radius: var(--app-radius);
  --el-card-padding: 20px;

  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
  cursor: pointer;
  transition:
    transform var(--app-transition),
    box-shadow var(--app-transition),
    border-color var(--app-transition);

  &:hover {
    transform: translateY(-3px);

    .card__footer-icon {
      transform: translateX(4px);
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    color: var(--el-text-color-primary);
    word-break: break-word;
  }

  &__description {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-regular);
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
    margin-top: 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-color-primary);
  }

  &__footer-icon {
    transition: transform var(--app-transition);
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--app-border);
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
