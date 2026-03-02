import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createTask, getTasks } from '@/api/tasks'
import { TTask, TTaskCreateRequest } from '@/api/tasks/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[]>([])
  const isLoading = ref(false)

  const loadTasks = async (boardId: string) => {
    try {
      isLoading.value = true
      const res = await getTasks(boardId)
      if (res.data) {
        tasks.value = res.data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createNewTask = async (data: TTaskCreateRequest) => {
    try {
      isLoading.value = true
      const res = await createTask(data)
      if (res) {
        await loadTasks()
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    tasks,
    isLoading,
    loadTasks,
    createNewTask,
  }
})
