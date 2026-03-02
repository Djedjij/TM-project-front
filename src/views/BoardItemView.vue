<script setup lang="ts">
import BaseStub from '@/components/base/stub/BaseStub.vue'
import CreateTaskModal from '@/components/modals/CreateTaskModal.vue'
import { storeToRefs } from 'pinia'
import { useBoardsStore } from '@/stores/boards'
import { useTasksStore } from '@/stores/tasks'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
const boardStore = useBoardsStore()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const route = useRoute()

const openCreateTaskModal = ref(false)

const boardId = computed(() => {
  const id = route.params.id
  return (Array.isArray(id) ? id[0] : id) || ''
})

onMounted(() => {
  if (boardId.value) {
    boardStore.loadBoard(boardId.value)
    tasksStore.loadTasks(boardId.value)
  }
})

const onListChange = (event: any) => {
  console.log('List changed:', event)
}

const closeModal = () => {
  openCreateTaskModal.value = false
}
</script>

<template>
  <div v-if="!boardStore.board && !boardStore.isLoading">
    <BaseStub description="Не удалось загрузить доску. Возможна она была удалена" />
  </div>
  <div class="wrapper" v-else v-loading="boardStore.isLoading">
    <h1>{{ boardStore.board?.title }}</h1>
    <div class="wrapper-actions">
      <BaseButton
        text="Создать задачу"
        @click="
          () => {
            openCreateTaskModal = true
          }
        "
      />
    </div>
    <div class="board">
      <draggable
        v-model="tasks"
        group="tasks"
        tag="div"
        class="board__list"
        @change="onListChange"
        item-key="id"
      >
        <div
          v-for="element in tasks"
          :key="element.id"
          class="board__card drag-item"
        >
          {{ element.title }}
        </div>
      </draggable>
    </div>
  </div>
  <CreateTaskModal v-model="openCreateTaskModal" :boardId="boardId" @close="closeModal" />
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.board {
  min-height: 200px;
  padding: 16px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 8px;
}

.board__list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  align-content: flex-start;
}

.board__card {
  padding: 12px 16px;
  min-width: 200px;
  min-height: 60px;
  background: var(--el-bg-color, #fff);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: box-shadow 0.2s;
}

.board__card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.board__card:active {
  cursor: grabbing;
}
</style>
