<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { TTask } from '@/api/tasks/types'

const props = defineProps<{
  task: TTask
}>()

const emit = defineEmits(['open'])

const createdAt = computed(() =>
  props.task.createdAt ? dayjs(props.task.createdAt).format('DD.MM.YYYY') : '',
)

const dueAt = computed(() => (props.task.dueAt ? dayjs(props.task.dueAt).format('DD.MM.YYYY') : ''))

const dueTitle = computed(() => (dueAt.value ? `до ${dueAt.value}` : ''))

const isOverdue = computed(
  () => !!props.task.dueAt && dayjs(props.task.dueAt).isBefore(dayjs(), 'day'),
)

const tags = computed(() => props.task.tag ?? [])
const visibleTags = computed(() => tags.value.slice(0, 3))
const hiddenTagsCount = computed(() => Math.max(tags.value.length - visibleTags.value.length, 0))
</script>

<template>
  <div
    class="task"
    :class="{ task_overdue: isOverdue }"
    role="button"
    tabindex="0"
    @click="emit('open')"
    @keydown.enter="emit('open')"
    @keydown.space.prevent="emit('open')"
  >
    <div class="task__header">
      <h4 class="task__title">{{ task.title }}</h4>
      <BaseTag v-if="dueTitle" :type="isOverdue ? 'danger' : 'warning'" :text="dueTitle" />
    </div>

    <p v-if="task.description" class="task__description">{{ task.description }}</p>

    <div v-if="visibleTags.length" class="task__tags">
      <span v-for="tag in visibleTags" :key="tag" class="task__tag">#{{ tag }}</span>
      <span v-if="hiddenTagsCount" class="task__tag task__tag_more">+{{ hiddenTagsCount }}</span>
    </div>

    <span v-if="createdAt" class="task__date">Создана {{ createdAt }}</span>
  </div>
</template>

<style scoped lang="scss">
.task {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 16px 16px 19px;
  overflow: hidden;
  background-color: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  box-shadow: var(--app-shadow-sm);
  transition:
    transform var(--app-transition),
    box-shadow var(--app-transition),
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background-color: var(--el-color-primary);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--app-shadow-md);
  }

  &_overdue::before {
    background-color: var(--el-color-danger);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  &__title {
    font-size: 15px;
    color: var(--el-text-color-primary);
    word-break: break-word;
  }

  &__description {
    font-size: 13px;
    line-height: 1.5;
    color: var(--el-text-color-regular);
    word-break: break-word;
  }

  &__tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    background-color: var(--app-surface-muted);
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius-pill);

    &_more {
      color: var(--el-text-color-secondary);
    }
  }

  &__date {
    margin-top: auto;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
