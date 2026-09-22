<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseStub from '@/components/base/stub/BaseStub.vue'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { EProjectStatus } from '@/api/projects/types'
import ProjectBoard from '@/components/project/projectBoard/ProjectBoard.vue'

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
        <ProjectBoard />
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: -10px;
    padding: 4px 10px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    text-decoration: none;
    border-radius: var(--app-radius-pill);
    transition:
      color var(--app-transition),
      background-color var(--app-transition);

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--app-surface-muted);
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
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  box-shadow: var(--app-shadow-sm);
  transition:
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);

  &__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__title {
    font-size: 24px;
    letter-spacing: -0.01em;
    color: var(--el-text-color-primary);
  }

  &__description {
    max-width: 720px;
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }

  &__meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 14px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__title {
    font-size: 20px;
    color: var(--el-text-color-primary);
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 22px;
    padding: 0 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary-light-8);
    border-radius: var(--app-radius-pill);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
}
</style>
