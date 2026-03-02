import { apiGet, apiPost } from '@/api/client'
import { TBoard, TBoardCreateRequest } from './types'
import { TResponse } from '../types'

export const getBoards = async () => {
  return await apiGet<TResponse<TBoard[]>>('/boards')
}

export const createBoard = async (data: TBoardCreateRequest) => {
  return await apiPost<TBoardCreateRequest>('/boards', data)
}

export const getBoard = async (id: string) => {
  return await apiGet<TResponse<TBoard>>(`/boards/${id}`)
}
