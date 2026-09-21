<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useColumnsStore } from '@/stores/columns'
const projectStore = useProjectsStore()
const tasksStore = useTasksStore()
const columnStore = useColumnsStore()
const { tasks } = storeToRefs(tasksStore)

const route = useRoute()

const openCreateTaskModal = ref(false)
const openCreateColumnModal = ref(false)

const projectId = computed(() => {
  const id = route.params.id
  return (Array.isArray(id) ? id[0] : id) || ''
})

onMounted(() => {
  if (projectId.value) {
    projectStore.loadProject(projectId.value)
    columnStore.loadColumns(projectId.value)
    tasksStore.loadTasks(projectId.value)
  }
})

const onListChange = (event: unknown) => {
  console.log('List changed:', event)
}

const closeModal = () => {
  openCreateTaskModal.value = false
  openCreateColumnModal.value = false
}
</script>

<template>
  <div v-if="!projectStore.project && !projectStore.isLoading">
    <BaseStub description="Не удалось загрузить проект. Возможно он был удалён" />
  </div>
  <div class="wrapper" v-else v-loading="projectStore.isLoading">
    <h1>{{ projectStore.project?.title }}</h1>
    <div class="wrapper-actions">
      <BaseButton
        text="Создать задачу"
        @click="
          () => {
            openCreateTaskModal = true
          }
        "
      />
      <BaseButton
        text="Создать колонку"
        @click="
          () => {
            openCreateColumnModal = true
          }
        "
      />
    </div>
    <div class="project">
      <draggable
        v-model="tasks"
        group="tasks"
        tag="div"
        class="project__list"
        @change="onListChange"
        item-key="id"
      >
        <div v-for="element in tasks" :key="element.id" class="project__card drag-item">
          {{ element.title }}
        </div>
      </draggable>
    </div>
  </div>
  <CreateTaskModal v-model="openCreateTaskModal" :projectId="projectId" @close="closeModal" />
  <CreateColumnModal v-model="openCreateColumnModal" :projectId="projectId" @close="closeModal" />
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project {
  min-height: 200px;
  padding: 16px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 8px;
}

.project__list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  align-content: flex-start;
}

.project__card {
  padding: 12px 16px;
  min-width: 200px;
  min-height: 60px;
  background: var(--el-bg-color, #fff);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: box-shadow 0.2s;
}

.project__card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.project__card:active {
  cursor: grabbing;
}
</style>
