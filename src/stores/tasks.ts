import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createTask, getTasks, updateTask } from '@/api/tasks'
import { ETaskStatus, TTask, TTaskCreateRequest } from '@/api/tasks/types'
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

  const updateTaskStatus = async (taskId: string, status: ETaskStatus) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task || task.status === status) return null

    const previousStatus = task.status ?? ETaskStatus.created

    // Оптимистично переносим задачу в новую колонку, откатываем при ошибке
    task.status = status

    try {
      const res = await updateTask(taskId, { status })
      if (res?.status && res.status !== status) {
        task.status = previousStatus
        toast.error('Сервер не подтвердил смену статуса задачи')
        return null
      }
      return res ?? null
    } catch (e) {
      console.log(e)
      task.status = previousStatus
      toast.error('Не удалось изменить статус задачи')
      return null
    }
  }

  return {
    tasks,
    isLoading,
    loadTasks,
    createNewTask,
    updateTaskStatus,
  }
})
