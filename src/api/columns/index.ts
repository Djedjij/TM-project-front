import { apiGet, apiPost } from '@/api/client'
import { TColumn, TColumnCreateRequest } from './types'
import { TResponse } from '../types'

export const getColumns = async () => {
  return await apiGet<TResponse<TColumn[]>>('/columns')
}

export const createColumn = async (data: TColumnCreateRequest) => {
  return await apiPost<TColumnCreateRequest>('/columns', data)
}

export const getColumn = async (id: string) => {
  return await apiGet<TResponse<TColumn>>(`/columns/${id}`)
}

