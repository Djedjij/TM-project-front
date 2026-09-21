import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createTask, getTasks } from '@/api/tasks'
import { TTask, TTaskCreateRequest } from '@/api/tasks/types'
import toast from '@/components/base/toast/toast'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[]>([])
  const isLoading = ref(false)

  const loadTasks = async (projectId: string) => {
    try {
      isLoading.value = true
      const res = await getTasks(projectId)
      tasks.value = res ?? []
    } catch (e) {
      console.log(e)
      tasks.value = []
      toast.error('Не удалось загрузить задачи проекта')
    } finally {
      isLoading.value = false
    }
  }

  const createNewTask = async (data: TTaskCreateRequest) => {
    try {
      isLoading.value = true
      const res = await createTask(data)
      if (res) {
        toast.success('Задача создана')
        if (data.projectId) {
          await loadTasks(data.projectId)
        }
      }
      return res ?? null
    } catch (e) {
      console.log(e)
      toast.error('Не удалось создать задачу')
      return null
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
