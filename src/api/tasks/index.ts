import { apiGet, apiPost } from '@/api/client'
import { TTask, TTaskCreateRequest } from './types'
import { TResponse } from '../types'

export const getTasks = async (id: string) => {
  return await apiGet<TResponse<TTask[]>>(`/todos/?board_id=${id}`)
}

export const createTask = async (data: TTaskCreateRequest) => {
  return await apiPost<TTaskCreateRequest>('/todos', data)
}
