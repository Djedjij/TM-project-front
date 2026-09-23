import { apiDelete, apiGet, apiPost, apiPut } from '@/api/client'
import { TTask, TTaskCreateRequest, TTaskUpdateRequest } from './types'

export const getTasks = async (projectId: string) => {
  return await apiGet<TTask[]>(`/tasks/project/${projectId}`)
}

export const getTask = async (id: string) => {
  return await apiGet<TTask>(`/tasks/${id}`)
}

export const createTask = async (data: TTaskCreateRequest) => {
  return await apiPost<TTask>('/tasks', data)
}

export const updateTask = async (id: string, data: TTaskUpdateRequest) => {
  return await apiPut<TTask>(`/tasks/${id}`, data)
}

export const removeTask = async (id: string) => {
  return await apiDelete<void>(`/tasks/${id}`)
}
