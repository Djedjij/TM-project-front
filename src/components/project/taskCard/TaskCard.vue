<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { TTask } from '@/api/tasks/types'

const props = defineProps<{
  task: TTask
}>()

const createdAt = computed(() =>
  props.task.createdAt ? dayjs(props.task.createdAt).format('DD.MM.YYYY') : '',
)

const dueAt = computed(() => (props.task.dueAt ? dayjs(props.task.dueAt).format('DD.MM.YYYY') : ''))

const dueTitle = computed(() => (dueAt.value ? `до ${dueAt.value}` : ''))
</script>

<template>
  <div class="task">
    <div class="task__header">
      <h4 class="task__title">{{ task.title }}</h4>
      <BaseTag v-if="dueTitle" type="warning" :text="dueTitle" />
    </div>

    <p v-if="task.description" class="task__description">{{ task.description }}</p>

    <span v-if="createdAt" class="task__date">Создана {{ createdAt }}</span>
  </div>
</template>

<style scoped lang="scss">
.task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 8px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
    word-break: break-word;
  }

  &__description {
    font-size: 13px;
    line-height: 1.5;
    color: var(--el-text-color-regular, #606266);
    word-break: break-word;
  }

  &__date {
    font-size: 12px;
    color: var(--el-text-color-secondary, #909399);
  }
}
</style>
