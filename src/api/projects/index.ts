import { apiGet, apiPost } from '@/api/client'
import { TProject, TProjectCreateRequest } from './types'
import { TResponse } from '../types'

export const getProjects = async () => {
  return await apiGet<TResponse<TProject[]>>('/projects')
}

export const getMyProjects = async () => {
  return await apiGet<TProject[]>('/projects/my')
}

export const createProject = async (data: TProjectCreateRequest) => {
  return await apiPost<TProject>('/projects', data)
}

export const getProject = async (id: string) => {
  return await apiGet<TProject>(`/projects/${id}`)
}
