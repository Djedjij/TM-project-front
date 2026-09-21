import { apiGet, apiPost } from '@/api/client'
import { TTask, TTaskCreateRequest } from './types'

export const getTasks = async (projectId: string) => {
  return await apiGet<TTask[]>(`/tasks/project/${projectId}`)
}

export const createTask = async (data: TTaskCreateRequest) => {
  return await apiPost<TTask>('/tasks', data)
}
