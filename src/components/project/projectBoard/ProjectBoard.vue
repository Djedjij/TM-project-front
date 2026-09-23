<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VueDraggableNext as draggable, type DragChangeEvent } from 'vue-draggable-next'
import BaseStub from '@/components/base/stub/BaseStub.vue'
import TaskCard from '@/components/project/taskCard/TaskCard.vue'
import TaskDrawer from '@/components/project/taskDrawer/TaskDrawer.vue'
import { confirmTaskDelete } from '@/components/project/taskActions'
import {
  TASK_STATUSES,
  TASK_STATUS_HINTS,
  TASK_STATUS_TITLES,
} from '@/components/project/taskStatus'
import { useTasksStore } from '@/stores/tasks'
import { ETaskStatus, TTask } from '@/api/tasks/types'

/** Задержка, в течение которой клик после перетаскивания не открывает панель задачи */
const DRAG_CLICK_DELAY = 200

const tasksStore = useTasksStore()

const { tasks, isLoading } = storeToRefs(tasksStore)

const selectedTaskId = ref<string | null>(null)
const isDrawerOpen = ref(false)
const isDragging = ref(false)

let dragEndedAt = 0

const selectedTask = computed(
  () => tasks.value.find((task) => task.id === selectedTaskId.value) ?? null,
)

// vue-draggable-next мутирует массивы напрямую, поэтому у каждой колонки собственный список
const columns = reactive<Record<ETaskStatus, TTask[]>>({
  [ETaskStatus.created]: [],
  [ETaskStatus.in_progress]: [],
  [ETaskStatus.done]: [],
  [ETaskStatus.cancelled]: [],
})

const getTaskStatus = (task: TTask) => task.status ?? ETaskStatus.created

const getColumnTasks = (status: ETaskStatus) => columns[status]

const syncColumns = () => {
  const grouped = new Map<ETaskStatus, TTask[]>(TASK_STATUSES.map((status) => [status, []]))

  tasks.value.forEach((task) => {
    const status = getTaskStatus(task)
    const list = grouped.get(status) ?? grouped.get(ETaskStatus.created)
    list?.push(task)
  })

  TASK_STATUSES.forEach((status) => {
    const list = columns[status]
    list.splice(0, list.length, ...(grouped.get(status) ?? []))
  })
}

watch(tasks, syncColumns, { deep: true, immediate: true })

const onTaskMove = (status: ETaskStatus, event: DragChangeEvent<TTask>) => {
  const task = event.added?.element

  if (!task || getTaskStatus(task) === status) return

  tasksStore.updateTaskStatus(task.id, status)
}

const openTask = (task: TTask) => {
  // Клик, завершивший перетаскивание, не должен открывать панель задачи
  if (isDragging.value || Date.now() - dragEndedAt < DRAG_CLICK_DELAY) return

  selectedTaskId.value = task.id
  isDrawerOpen.value = true
}

const onDragStart = () => {
  isDragging.value = true
}

const onDragEnd = () => {
  isDragging.value = false
  dragEndedAt = Date.now()
}

const onTaskDeleted = () => {
  selectedTaskId.value = null
}

/** Удаление задачи из контекстного меню карточки */
const onTaskDelete = async (task: TTask) => {
  if (!(await confirmTaskDelete(task.title))) return

  const isDeleted = await tasksStore.deleteTaskById(task.id)

  if (isDeleted && selectedTaskId.value === task.id) {
    onTaskDeleted()
    isDrawerOpen.value = false
  }
}
</script>

<template>
  <BaseStub
    v-if="!tasks.length && !isLoading"
    description="В проекте пока нет задач. Создайте первую задачу"
  />

  <div v-else class="board">
    <section
      v-for="status in TASK_STATUSES"
      :key="status"
      class="board__column"
      :data-status="status"
    >
      <header class="board__header">
        <span class="board__marker" />
        <h3 class="board__title">{{ TASK_STATUS_TITLES[status] }}</h3>
        <span class="board__count">{{ getColumnTasks(status).length }}</span>
      </header>

      <draggable
        :list="getColumnTasks(status)"
        group="project-tasks"
        item-key="id"
        :sort="false"
        class="board__list"
        ghost-class="board__card_ghost"
        drag-class="board__card_drag"
        :animation="150"
        @change="onTaskMove(status, $event)"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <TaskCard
          v-for="task in getColumnTasks(status)"
          :key="task.id"
          :task="task"
          @open="openTask(task)"
          @delete="onTaskDelete(task)"
        />
      </draggable>

      <p v-if="!getColumnTasks(status).length" class="board__empty">
        {{ TASK_STATUS_HINTS[status] }}
      </p>
    </section>
  </div>

  <TaskDrawer v-model="isDrawerOpen" :task="selectedTask" @deleted="onTaskDeleted" />
</template>

<style scoped lang="scss">
.board {
  display: flex;
  align-items: stretch;
  gap: 16px;
  width: 100%;
  padding-bottom: 4px;
  overflow-x: auto;
}

.board__column {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 12px;
  min-width: 240px;
  min-height: 260px;
  max-height: 70vh;
  padding: 14px;
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  box-shadow: var(--app-shadow-sm);
  transition:
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);

  &[data-status='created'] .board__marker {
    background-color: var(--el-color-info);
  }

  &[data-status='in_progress'] .board__marker {
    background-color: var(--el-color-primary);
  }

  &[data-status='done'] .board__marker {
    background-color: var(--el-color-success);
  }

  &[data-status='cancelled'] .board__marker {
    background-color: var(--el-color-danger);
  }
}

.board__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.board__marker {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.board__title {
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--el-text-color-primary);
}

.board__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 20px;
  margin-left: auto;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  background-color: var(--app-surface-muted);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-pill);
}

.board__list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  min-height: 60px;
  overflow-y: auto;

  :deep(.task) {
    cursor: grab;
  }

  :deep(.board__card_ghost) {
    opacity: 0.45;
    border-style: dashed;
    border-color: var(--el-color-primary);
  }

  :deep(.board__card_drag) {
    cursor: grabbing;
    box-shadow: var(--app-shadow-lg);
  }
}

.board__empty {
  padding: 12px 4px;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  color: var(--el-text-color-secondary);
}
</style>
