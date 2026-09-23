import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createTask, getTasks, removeTask, updateTask } from '@/api/tasks'
import { ETaskStatus, TTask, TTaskCreateRequest, TTaskUpdateRequest } from '@/api/tasks/types'
import toast from '@/components/base/toast/toast'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TTask[]>([])
  const isLoading = ref(false)

  /**
   * Заменяет задачу в списке актуальной записью с сервера.
   */
  const replaceTask = (task: TTask) => {
    const index = tasks.value.findIndex((item) => item.id === task.id)
    if (index !== -1) {
      tasks.value[index] = task
    }
  }

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
      // status задаём явно: новая задача всегда попадает в колонку «Новые»
      const res = await createTask({ status: ETaskStatus.created, ...data })
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

  /**
   * Редактирование задачи: название, описание, срок выполнения.
   */
  const updateTaskData = async (taskId: string, data: TTaskUpdateRequest) => {
    try {
      const res = await updateTask(taskId, data)
      if (res) {
        replaceTask(res)
        toast.success('Задача обновлена')
      }
      return res ?? null
    } catch (e) {
      console.log(e)
      toast.error('Не удалось обновить задачу')
      return null
    }
  }

  /**
   * Перезапись списка тегов задачи.
   */
  const updateTaskTags = async (taskId: string, tag: string[]) => {
    try {
      const res = await updateTask(taskId, { tag })
      if (res) {
        replaceTask(res)
      }
      return res ?? null
    } catch (e) {
      console.log(e)
      toast.error('Не удалось обновить теги задачи')
      return null
    }
  }

  const deleteTaskById = async (taskId: string) => {
    try {
      await removeTask(taskId)
      tasks.value = tasks.value.filter((item) => item.id !== taskId)
      toast.success('Задача удалена')
      return true
    } catch (e) {
      console.log(e)
      toast.error('Не удалось удалить задачу')
      return false
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
    updateTaskData,
    updateTaskTags,
    deleteTaskById,
    updateTaskStatus,
  }
})
