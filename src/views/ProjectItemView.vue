<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseStub from '@/components/base/stub/BaseStub.vue'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import TaskCard from '@/components/project/taskCard/TaskCard.vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { EProjectStatus } from '@/api/projects/types'

const props = defineProps<{
  id: string
}>()

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const { tasks, isLoading: isTasksLoading } = storeToRefs(tasksStore)

const createTaskModalOpen = ref(false)

const project = computed(() => projectsStore.project)
const isLoading = computed(() => projectsStore.isLoading || isTasksLoading.value)
const members = computed(() => project.value?.members ?? [])

const projectStatusTitle = computed(() => {
  switch (project.value?.status) {
    case EProjectStatus.active:
      return 'Активный'
    case EProjectStatus.paused:
      return 'На паузе'
    default:
      return 'Нет статуса'
  }
})

const loadProjectData = async (projectId: string) => {
  if (!projectId) return

  await Promise.all([projectsStore.loadProject(projectId), tasksStore.loadTasks(projectId)])
}

watch(() => props.id, loadProjectData, { immediate: true })

const closeCreateTaskModal = () => {
  createTaskModalOpen.value = false
}
</script>

<template>
  <div class="page">
    <router-link class="page__back" :to="{ name: 'home' }">← Все проекты</router-link>

    <div v-if="!project && !projectsStore.isLoading">
      <BaseStub description="Не удалось загрузить проект. Возможно, он был удалён" />
    </div>

    <div v-else v-loading="isLoading" class="page__content">
      <section class="project">
        <div class="project__info">
          <div class="project__title-row">
            <h1 class="project__title">{{ project?.title }}</h1>
            <BaseTag v-if="project?.status" :type="project.status" :text="projectStatusTitle" />
          </div>
          <p class="project__description">
            {{ project?.description || 'Описание проекта не заполнено' }}
          </p>
          <div class="project__meta">
            <span v-if="project?.owner">Владелец: {{ project.owner.email }}</span>
            <span>Участников: {{ members.length }}</span>
          </div>
        </div>

        <div class="project__actions">
          <BaseButton text="Создать задачу" @click="createTaskModalOpen = true" />
        </div>
      </section>

      <section class="tasks">
        <div class="tasks__header">
          <h2 class="tasks__title">Задачи</h2>
          <span class="tasks__count">{{ tasks.length }}</span>
        </div>

        <BaseStub
          v-if="!tasks.length && !isTasksLoading"
          description="В проекте пока нет задач. Создайте первую задачу"
        />

        <div v-else class="tasks__list">
          <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
        </div>
      </section>
    </div>

    <CreateTaskModal
      v-model="createTaskModalOpen"
      :project-id="props.id"
      @close="closeCreateTaskModal"
    />
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__back {
    align-self: flex-start;
    font-size: 14px;
    color: var(--el-text-color-secondary, #909399);
    text-decoration: none;

    &:hover {
      color: var(--el-color-primary, #409eff);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.project {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding: 24px;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
  }

  &__description {
    max-width: 720px;
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-regular, #606266);
  }

  &__meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 14px;
    font-size: 13px;
    color: var(--el-text-color-secondary, #909399);
  }
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
  }

  &__count {
    padding: 2px 10px;
    font-size: 13px;
    color: var(--el-text-color-secondary, #909399);
    background-color: var(--el-fill-color-light, #f5f7fa);
    border-radius: 12px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
}
</style>
